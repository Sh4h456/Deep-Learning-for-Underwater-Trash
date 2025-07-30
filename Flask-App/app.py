import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import cv2
import google.generativeai as genai
from dotenv import load_dotenv
import numpy as np

load_dotenv()

# --- Initialization and Configuration ---
# Serve the React build files (for production)
app = Flask(__name__, static_folder='../react-app/build', static_url_path='/')
CORS(app) # Enable Cross-Origin Resource Sharing for development

UPLOAD_FOLDER = 'static/uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Google Gemini API Key Configuration ---
try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
    print("Google Gemini API key configured successfully.")
except KeyError:
    print("CRITICAL ERROR: The GOOGLE_API_KEY environment variable is not set.")

# --- Model Loading ---
try:
    print("Loading YOLOv8 model...")
    model = YOLO('best.pt')
    print("YOLOv8 model loaded successfully.")
except Exception as e:
    print(f"CRITICAL ERROR: Failed to load YOLOv8 model: {e}")
    model = None

# --- NEW: Route to serve uploaded files ---
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# --- API Route Definitions ---

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model is not loaded"}), 500
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        original_filename = file.filename
        original_filepath = os.path.join(app.config['UPLOAD_FOLDER'], original_filename)
        file.save(original_filepath)

        confidence_threshold = float(request.form.get('confidence', 0.5))
        results = model(original_filepath, conf=confidence_threshold)

        # Save annotated image
        annotated_image_array = results[0].plot()
        annotated_image_rgb = cv2.cvtColor(annotated_image_array, cv2.COLOR_BGR2RGB)
        annotated_image_pil = Image.fromarray(annotated_image_rgb)
        result_filename = 'result_' + original_filename
        result_filepath = os.path.join(app.config['UPLOAD_FOLDER'], result_filename)
        annotated_image_pil.save(result_filepath)

        # --- UPDATED: Simplified Detection Summary (Count Only) ---
        names = model.names
        detection_summary = {}
        if results[0].boxes:
            for box in results[0].boxes:
                class_name = names[int(box.cls)]
                detection_summary[class_name] = detection_summary.get(class_name, 0) + 1
        
        return jsonify({
            "original_image": f"/uploads/{original_filename}",
            "result_image": f"/uploads/{result_filename}",
            "summary": detection_summary
        })

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