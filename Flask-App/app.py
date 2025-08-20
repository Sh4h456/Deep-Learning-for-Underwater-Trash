import os
import json 
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import cv2
import google.generativeai as genai
from dotenv import load_dotenv
import numpy as np
from werkzeug.utils import secure_filename

load_dotenv()

# --- Initialization and Configuration ---
FRONTEND_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'react-app', 'build'))
app = Flask(__name__, static_folder=FRONTEND_FOLDER, static_url_path='/')

CORS(app) 

UPLOAD_FOLDER = 'static/uploads/'
PROCESSED_FOLDER = 'static/processed/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# --- Google Gemini API Key Configuration ---

try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
    print("Google Gemini API key configured successfully.")
except KeyError:
    print("CRITICAL ERROR: The GOOGLE_API_KEY environment variable is not set.")

# --- Model Loading ---

def get_model():
    """
    Loads the YOLO model if it hasn't been loaded yet (Singleton Pattern).
    This function ensures the memory-intensive model is loaded only once,
    and only when it's first needed.
    """
    global model
    if model is None:
        print("--- LAZY LOADING: Loading YOLOv8 model for the first time... ---")
        try:
            model = YOLO('best.pt')
            print("--- LAZY LOADING: Model loaded successfully. ---")
        except Exception as e:
            print(f"CRITICAL ERROR: Failed to lazy-load YOLOv8 model: {e}")
            # The model will remain None if loading fails
    return model

### --- NEW: Load Ground Truth Data --- ###
def load_ground_truth_data(files):
    """
    Loads and processes standard format (COCO-like) JSON annotation files
    and transforms them into a simple {filename: annotations} dictionary.
    """
    processed_data = {}
    for file_path in files:
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)

            # --- Data Transformation Logic ---
            
            # 1. Create a map from image_id to filename
            image_id_to_filename = {image['id']: image['file_name'] for image in data['images']}
            
            # 2. Create a map from category_id to category_name
            category_id_to_name = {cat['id']: cat['name'] for cat in data['categories']}

            # 3. Group annotations by filename
            annotations_by_filename = {}
            for ann in data['annotations']:
                image_id = ann['image_id']
                if image_id in image_id_to_filename:
                    filename = image_id_to_filename[image_id]
                    
                    # Initialize the list for this filename if it's the first time
                    if filename not in annotations_by_filename:
                        annotations_by_filename[filename] = []
                    
                    # COCO format bbox is [x, y, width, height]
                    # We need [xmin, ymin, xmax, ymax] for drawing with cv2
                    x, y, w, h = ann['bbox']
                    xmin = int(x)
                    ymin = int(y)
                    xmax = int(x + w)
                    ymax = int(y + h)

                    # Add the processed annotation
                    annotations_by_filename[filename].append({
                        "label": category_id_to_name.get(ann['category_id'], 'unknown'),
                        "bbox": [xmin, ymin, xmax, ymax]
                    })
            
            # Merge the processed data into our main dictionary
            processed_data.update(annotations_by_filename)
            print(f"Successfully processed and loaded ground truth data from {file_path}")
            
        except FileNotFoundError:
            print(f"WARNING: Ground truth file not found: {file_path}")
        except (json.JSONDecodeError, KeyError) as e:
            print(f"WARNING: Could not process JSON from {file_path}. Is it a valid COCO format? Error: {e}")
            
    # Print a sample to confirm it worked
    if processed_data:
        print(f"Data processing complete. Sample entry: {list(processed_data.items())[0]}")
        
    return processed_data

# List your ground truth JSON files here
ground_truth_files = ['instances_train_trashcan.json'] # Make sure these are the right filenames
ground_truth_data = load_ground_truth_data(ground_truth_files)


# --- Route to serve uploaded files ---
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/processed/<path:filename>')
def processed_file(filename):
    return send_from_directory(app.config['PROCESSED_FOLDER'], filename)


# --- API Route Definitions ---

### --- UPDATED: /api/predict route --- ###
@app.route('/api/predict', methods=['POST'])
def predict():
    current_model = get_model()
    if current_model is None:
        return jsonify({"error": "Model is not loaded"}), 500
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        original_filename = file.filename
        print(f"--- DEBUGGING AquaVision ---")
        print(f"1. Received filename from upload: '{original_filename}'")

        if original_filename in ground_truth_data:
            print(f"2. SUCCESS: Found a match for '{original_filename}' in ground_truth_data.")
        else:
            print(f"2. FAILURE: No match for '{original_filename}' in ground_truth_data.")

            print(f"   Available keys look like this: {list(ground_truth_data.keys())[:5]}") 
        original_filepath = os.path.join(app.config['UPLOAD_FOLDER'], original_filename)
        file.save(original_filepath)

        # 1. GET PREDICTION RESULTS (same as before)
        confidence_threshold = float(request.form.get('confidence', 0.2))
        results = model(original_filepath, conf=confidence_threshold)
        
        # Save predicted image
        annotated_image_array = results[0].plot() # This draws detection boxes
        annotated_image_rgb = cv2.cvtColor(annotated_image_array, cv2.COLOR_BGR2RGB)
        annotated_image_pil = Image.fromarray(annotated_image_rgb)
        result_filename = 'predicted_' + original_filename # Renamed for clarity
        result_filepath = os.path.join(app.config['UPLOAD_FOLDER'], result_filename)
        annotated_image_pil.save(result_filepath)
        
        # Create prediction summary
        names = model.names
        prediction_summary = {}
        if results[0].boxes:
            for box in results[0].boxes:
                class_name = names[int(box.cls)]
                prediction_summary[class_name] = prediction_summary.get(class_name, 0) + 1

        # 2. CREATE GROUND TRUTH IMAGE (NEW LOGIC)
        gt_filename = None
        gt_summary = {}
        
        # Look for the filename in our loaded ground truth data
        if original_filename in ground_truth_data:
            # Load the original image with OpenCV to draw on it
            image_to_draw_on = cv2.imread(original_filepath)
            
            gt_info = ground_truth_data[original_filename]
            gt_summary = {}

            for annotation in gt_info:
                label = annotation["label"]
                bbox = annotation["bbox"]
                
                # Draw the rectangle (using green color for GT)
                cv2.rectangle(image_to_draw_on, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)
                # Draw the label
                cv2.putText(image_to_draw_on, label, (bbox[0], bbox[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                
                gt_summary[label] = gt_summary.get(label, 0) + 1
            
            # Save the new ground truth image
            gt_filename = 'gt_' + original_filename
            gt_filepath = os.path.join(app.config['UPLOAD_FOLDER'], gt_filename)
            cv2.imwrite(gt_filepath, image_to_draw_on)

        # 3. CONSTRUCT FINAL JSON RESPONSE
        response_data = {
            "original_image_url": f"/uploads/{original_filename}",
            "predicted_image_url": f"/uploads/{result_filename}",
            "prediction_summary": prediction_summary
        }
        
        # Only add ground truth info if it was found
        if gt_filename:
            response_data["ground_truth_image_url"] = f"/uploads/{gt_filename}"
            response_data["ground_truth_summary"] = gt_summary
        
        return jsonify(response_data)

    return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/predict-video', methods=['POST'])
def predict_video():
    current_model = get_model()
    if current_model is None:
        return jsonify({"error": "Model is not loaded"}), 500
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        # 1. Save the uploaded video securely
        filename = secure_filename(file.filename)
        input_video_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(input_video_path)

        # 2. Define output path
        output_filename = f"processed_{filename}"
        output_video_path = os.path.join(app.config['PROCESSED_FOLDER'], output_filename)

        try:
            # 3. Process the video using OpenCV
            cap = cv2.VideoCapture(input_video_path)
            
            # Get video properties (width, height, fps)
            frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = int(cap.get(cv2.CAP_PROP_FPS))

            # Define the codec and create VideoWriter object
            fourcc = cv2.VideoWriter_fourcc(*'mp4v') # Use 'mp4v' for .mp4 files
            out = cv2.VideoWriter(output_video_path, fourcc, fps, (frame_width, frame_height))

            print(f"Processing video: {filename}...")
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break # End of video

                # Run YOLOv8 inference on the frame
                results = model(frame)

                # Get the annotated frame with detections
                annotated_frame = results[0].plot()

                # Write the annotated frame to the output video
                out.write(annotated_frame)
            
            # Release video resources
            cap.release()
            out.release()
            print(f"Video processing complete. Saved to {output_video_path}")

            # 4. Return the URL to the processed video
            return jsonify({'processed_video_url': f'/processed/{output_filename}'})
        
        except Exception as e:
            print(f"An error occurred during video processing: {e}")
            return jsonify({'error': 'Failed to process video'}), 500

    return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    if not os.environ.get("GOOGLE_API_KEY"):
        return jsonify({"reply": "Chatbot API key is not configured."})

    try:
        gemini_model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            "You are AquaBot, a friendly expert in marine biology, oceanography, and underwater pollution. "
            "Answer questions clearly and engagingly. "
            f"\n\nUSER QUESTION: {user_message}"
        )
        response = gemini_model.generate_content(prompt)
        return jsonify({"reply": response.text})
    except Exception as e:
        print(f"ERROR: Gemini API call failed: {e}")
        return jsonify({"reply": "Sorry, I'm having trouble right now."}), 500

# Serve React App (for production)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True, port=5001)