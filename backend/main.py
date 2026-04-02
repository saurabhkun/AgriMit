import os
import io
import cv2
import logging
import datetime
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# 🛠️ INTERNAL MODULE IMPORT
try:
    from recommender import generate_recovery_plan
    from validators import check_image_quality, extract_live_gps
except ImportError:
    logger = logging.getLogger("AgriMit.API")
    logger.warning("Custom modules not found. Ensure recommender.py and validators.py are in the root.")

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AgriMit.API")

app = FastAPI(title="AgriMit Master Hub - Stable Core Build")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

# 1. THE BRAIN (CRITICAL: Order must match your old model's training)
CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildnesw', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

MODEL = None
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.on_event("startup")
async def startup_event():
    global MODEL
    # Ensure this points to your STABLE model file
    model_path = os.path.join(BASE_DIR, "models", "agrimit_v2_production.h5")
    try:
        if os.path.exists(model_path):
            MODEL = tf.keras.models.load_model(model_path, compile=False)
            logger.info("✅ AgriMit Stable-Core Engine: ONLINE")
        else:
            logger.error(f"❌ CRITICAL: Model file not found at {model_path}")
    except Exception as e:
        logger.error(f"❌ CRITICAL: Model mount failed: {e}")

def get_env_analysis(lat: float, lon: float):
    """Simulated IoT Environment Data based on coordinates"""
    return {
        "humidity": "88.5%",
        "temperature": "24.2°C",
        "leaf_wetness": "Detected",
        "risk_index": "HIGH",
        "soil_condition": "Moist (Ideal for Fungal spread)"
    }

@app.post("/v1/analyze")
async def analyze_crop(file: UploadFile = File(...), lang: str = Query("English")):
    if MODEL is None: 
        raise HTTPException(status_code=500, detail="Model Offline")

    try:
        image_bytes = await file.read()
        
        # --- STAGE 1: IMAGE VALIDATION & GPS ---
        is_valid, msg = check_image_quality(image_bytes)
        if not is_valid:
            return {"status": "error", "message": msg}

        lat, lon = extract_live_gps(image_bytes)

        # --- STAGE 2: STABLE PREPROCESSING ---
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (224, 224))
        
        # Normalization: Simple 1/255 for stability with older models
        img_array = img.astype('float32') / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # --- STAGE 3: INFERENCE ---
        preds = MODEL.predict(img_array, verbose=0)
        idx = int(np.argmax(preds[0]))
        confidence = float(np.max(preds[0]))

        # --- STAGE 4: CONFIDENCE GATE ---
        if confidence < 0.25:
            return {
                "status": "uncertain",
                "message": "Confidence low. Please ensure clear lighting and centered focus.",
                "confidence": round(confidence, 4)
            }

        # --- STAGE 5: RESULT PARSING ---
        raw_label = CLASS_NAMES[idx]
        crop, disease = raw_label.split("___") if "___" in raw_label else (raw_label, "Healthy")
        severity = "High" if any(x in disease for x in ["Virus", "Blight", "Mite"]) else "Moderate"

        # Generate recovery plan using your existing logic
        plan = generate_recovery_plan(disease, crop, lat, lon, lang)
        env_data = get_env_analysis(lat, lon)

        return {
            "status": "success",
            "prediction": {
                "crop": crop.replace("_", " "),
                "disease": disease.replace("_", " "),
                "confidence": f"{round(confidence * 100, 1)}%",
                "severity": severity
            },
            "environmental_analysis": env_data,
            "recovery_plan": plan,
            "metadata": {
                "location": f"{lat}, {lon}",
                "timestamp": datetime.datetime.now().strftime("%I:%M %p"),
                "engine": "AgriMit Stable-Core v1.5"
            }
        }

    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)