# AquaVision: AI-Powered Underwater Debris Detection

<img width="1912" height="882" alt="image" src="https://github.com/user-attachments/assets/14d6b4af-1f3f-4c01-97ff-f9dab6a906cf" />


AquaVision is a full-stack web application designed for the detection of marine debris in underwater imagery. It leverages a custom-trained YOLOv8 model, served by a Python Flask API, and is presented through a dynamic and interactive React frontend. This project was developed as part of a Master's Final Year Project.

## Features

-   **AI-Powered Detection:** Utilizes a state-of-the-art YOLOv8 object detection model to identify debris.
-   **Interactive Frontend:** A modern application built with React for a seamless user experience.
-   **Immersive Landing Page:** A dynamic entry point with a video background to welcome users.
-   **Model Performance Dashboard:** Dedicated pages to visualize and analyze model training metrics (mAP and Training Loss).
-   **Model Comparison:** A side-by-side visual and quantitative comparison between YOLOv7 and YOLOv8 models.
-   **AI Chatbot:** An integrated "AquaBot" powered by Google Gemini to answer questions about marine life and pollution.

## Tech Stack

**Backend:**
-   **Framework:** Flask
-   **AI Model:** YOLOv8 (Ultralytics)
-   **API:** RESTful API for predictions and chat
-   **LLM:** Google Gemini API

**Frontend:**
-   **Framework:** React.js
-   **Styling:** Tailwind CSS
-   **Routing:** React Router
-   **Charts:** Recharts
-   **Icons:** Lucide React

## Setup and Installation

Follow these instructions to get a local copy up and running.

### Prerequisites

-   Python 3.8+
-   Node.js and npm
-   A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    
    git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    cd YOUR_REPO_NAME
    

2.  **Setup the Backend (Flask-App):**
    
    cd Flask-App (you can rename it to backend as well)
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    

3.  **Setup Environment Variables:**
    -   Create a file named `.env` inside the `Flask-App` folder.
    -   Add your Google Gemini API key to it:
        ```
        GOOGLE_API_KEY="YOUR_API_KEY_HERE"
        ```

4.  **Download the Model File:**
    -   The trained model weights (`best.pt`) are included in the repository
    -   Place the `best.pt` file inside the `Flask-App` directory.

5.  **Setup the Frontend (react-app):**
    ```bash
    cd ../react-app
    npm install
    ```

### Running the Application

You need to run two servers concurrently in two separate terminals.

1.  **Start the Backend Server:**
    -   From the `Flask-App` directory (with venv activated):
    ```bash
    python app.py
    ```
    The API will be running on `http://127.0.0.1:5001`.

2.  **Start the Frontend Server:**
    -   From the `react-app` directory:
    ```bash
    npm start
    ```
    The application will open automatically in your browser at `http://localhost:3000`.

## Project Structure
/
├── Flask-App/ # Flask API, AI model, and server logic
│ ├── static/
│ ├── venv/
│ ├── app.py
│ ├── best.pt
│ └── requirements.txt
└── react-app/ # React frontend application
├── public/
├── src/
├── package.json
└── tailwind.config.js

## Model Training
1.  **DataPreprocesing&ExploratoryDataAnalysis:**
Performs exploratory data analysis and formatting of the dataset in YOLOv8-compatible COCO format.

Includes:
Directory structure checks
Label integrity verification
Dataset statistics (image size, class distribution)
Bounding box visualization

2.  **Color Correction:**
Enhances underwater image clarity using deep learning-based image enhancement models (e.g., FUnIE-GAN or Water-Net).

Applies:
Pretrained color correction models
Batch enhancement on training/validation images

4.  **Model Training:**
   
Trains a custom YOLOv8 model integrated with:
CBAM for spatial and channel attention
Swin Transformer blocks for better context modeling

Includes:
Model customization via custom_modules.py
Custom YAML configuration for new backbone layers
Training with evaluation metrics like mAP50 and mAP50-95
