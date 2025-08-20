# AquaVision: AI-Powered Underwater Debris Detection

<img width="1912" height="882" alt="image" src="https://github.com/user-attachments/assets/14d6b4af-1f3f-4c01-97ff-f9dab6a906cf" />



# AquaVision 

**AquaVision** is a full-stack web application designed for the detection of marine debris in underwater imagery. It leverages a **custom-trained YOLOv8 model**, served via a **Flask API**, and delivered through an interactive **React frontend**. This project was developed as part of a **Master's Final Year Project** in Data Science.

---

##  Features

- **AI-Powered Detection:** Uses a YOLOv8-based object detection model enhanced with CBAM and Swin Transformer.
- **Interactive Frontend:** A modern React-based UI for seamless interaction.
- **Immersive Landing Page:** A visually engaging entry point with a video background.
- **Model Performance Dashboard:** Visualizes training metrics such as mAP and loss curves.
- **Model Comparison:** Side-by-side visual and metric-based comparison of YOLOv7 and YOLOv8 models.
- **AI Chatbot (AquaBot):** An integrated chatbot powered by Google Gemini for marine life and pollution queries.

---

##  Tech Stack

### Backend:
- **Framework:** Flask
- **Model:** YOLOv8 (Ultralytics) with CBAM + Swin Transformer
- **API:** RESTful API for predictions and chat
- **LLM:** Google Gemini API (via environment variable)

### Frontend:
- **Framework:** React.js
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Charts:** Recharts
- **Icons:** Lucide React

---

## ⚙️ Setup and Installation

### 🔐 Prerequisites
- Python 3.8+
- Node.js and npm
- Google Gemini API Key

### 🧩 Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/AquaVision.git
   cd AquaVision
   ```

2. **Backend Setup (Flask App)**
   ```bash
   cd Flask-App
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**
   - Create a `.env` file inside `Flask-App/` and add:
     ```
     GOOGLE_API_KEY="YOUR_API_KEY_HERE"
     ```

4. **Download and Place the YOLO Model**
   - Copy your trained `best.pt` model weights into the `Flask-App/` directory.

5. **Frontend Setup (React App)**
   ```bash
   cd ../react-app
   npm install
   ```

---

## 🖥️ Running the Application

> Run backend and frontend in separate terminals.

1. **Start Flask Backend**
   ```bash
   cd Flask-App
   source venv/bin/activate
   python app.py
   ```
   > Runs at: `http://127.0.0.1:5001`

2. **Start React Frontend**
   ```bash
   cd react-app
   npm start
   ```
   > Opens at: `http://localhost:3000`

---

##  Project Structure

```
/
├── Flask-App/         # Flask API, YOLO model, server logic
│   ├── app.py
│   ├── best.pt
│   ├── static/
│   ├── requirements.txt
│   └── .env
├── react-app/         # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

##  Model Training Pipeline

### 1️⃣ Data Preprocessing & EDA
- Formats dataset in YOLOv8-compatible COCO format.
- Includes:
  - Directory structure validation
  - Label integrity checks
  - Class distribution visualization
  - Bounding box inspection

### 2️⃣ Underwater Image Enhancement
- Enhances images using models like **FUnIE-GAN** or **Water-Net**.
- Applies:
  - Pretrained color correction models
  - Batch processing on training/validation sets

### 3️⃣ YOLOv8 Model Training
- Trains a **custom YOLOv8** model with:
  - **CBAM** for channel and spatial attention
  - **Swin Transformer** for local/global context
- Includes:
  - Custom `custom_modules.py` and YAML model configuration
  - Training with evaluation metrics (mAP50, mAP50-95)

---

##  Contact

For questions, reach out at: **khanshahswar45@gmail.com**

---

## 🧠 Acknowledgments
- Ultralytics YOLOv8
- FUnIE-GAN / Water-Net
- OpenAI, Google Gemini API

