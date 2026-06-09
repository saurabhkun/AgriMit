import os
import io
import cv2
import logging
import datetime
import json
import numpy as np
import tensorflow as tf
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# 🛠️ DIRECT INTERNAL MODULE IMPORT 
from recommender import generate_recovery_plan
from validators import check_image_quality, extract_live_gps

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AgriMit.API")

app = FastAPI(title="AgriVision AI Crop Intelligence")

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

MODEL = None
CLASS_NAMES = []
BASE_DIR = Path(__file__).parent.resolve()

@app.on_event("startup")
async def startup_event():
    global MODEL, CLASS_NAMES
    models_dir = BASE_DIR / "models"
    model_path = models_dir / "best_agrivision_model.keras"
    class_names_path = models_dir / "class_names.json"
    
    try:
        if class_names_path.exists():
            with open(class_names_path, "r", encoding="utf-8") as f:
                CLASS_NAMES = json.load(f)
            logger.info(f"✅ Loaded {len(CLASS_NAMES)} classes from {class_names_path}")
        else:
            logger.error(f"❌ CRITICAL: class_names.json not found at {class_names_path}")
            
        if model_path.exists():
            MODEL = tf.keras.models.load_model(str(model_path), compile=False)
            logger.info(f"✅ AgriVision Model ONLINE (Model: {model_path.name})")
        else:
            logger.error(f"❌ CRITICAL: Model file not found at {model_path}")
    except Exception as e:
        logger.error(f"❌ CRITICAL: Model mount failed: {e}")

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": MODEL is not None,
        "classes_loaded": len(CLASS_NAMES)
    }

@app.post("/v1/analyze")
async def analyze_crop(file: UploadFile = File(...), lang: str = Query("English")):
    if MODEL is None or not CLASS_NAMES: 
        raise HTTPException(status_code=500, detail="Model or classes Offline - Check 'models/' folder")

    try:
        image_bytes = await file.read()
        
        # --- STAGE 1: QUALITY & GPS (From validators.py) ---
        is_valid, msg = check_image_quality(image_bytes)
        if not is_valid:
            return {"status": "error", "message": msg}

        lat, lon = extract_live_gps(image_bytes)

        # --- STAGE 2: PREPROCESSING ---
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return {"status": "error", "message": "Failed to decode image."}

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB) # RGB Conversion
        img = cv2.resize(img, (160, 160))
        
        img_array = np.expand_dims(img, axis=0)
        img_array = img_array.astype(np.float32) / 255.0 # Normalize 0-1

        # --- STAGE 3: INFERENCE ---
        predictions = MODEL(img_array, training=False)
        preds_numpy = predictions.numpy()
        
        idx = int(np.argmax(preds_numpy[0]))
        confidence = float(np.max(preds_numpy[0]))

        # --- CONFIDENCE GATE ---
        if confidence < 0.60:
            return {
                "status": "low_confidence",
                "message": "Prediction confidence is low. Please upload a clearer leaf image."
            }

        # --- STAGE 4: RESULT PARSING ---
        raw_label = CLASS_NAMES[idx]
        crop, disease = raw_label.split("___") if "___" in raw_label else (raw_label, "Healthy")
        crop = crop.replace("_", " ")
        disease = disease.replace("_", " ")
        
        severity = "High" if any(x in disease for x in ["Virus", "Blight", "Mite", "Rot", "scab", "spot"]) else "Moderate"
        if disease.lower() == "healthy":
            severity = "None"

        # Generate recovery plan (From recommender.py)
        plan = generate_recovery_plan(disease, crop, confidence, severity, lat, lon, lang)

        return {
            "status": "success",
            "prediction": {
                "crop": crop,
                "disease": disease,
                "confidence": round(confidence, 4),
                "severity": severity
            },
            "recovery_plan": plan,
            "metadata": {
                "model": "best_agrivision_model.keras",
                "classes": len(CLASS_NAMES)
            }
        }

    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)