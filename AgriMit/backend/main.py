main.py
-------
Agrimit FastAPI backend application.
"""

import io
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ml_stubs import run_cnn_stub, analyze_time_series_stub, generate_advice_stub, chat_llm_stub
from schemas import (
    FieldSummary,
    FieldDetail,
    ImageAnalysisResult,
    SensorAnalysisResult,
    AdviceResult,
    SensorAnalysisRequest,
    FuseAndAdviseRequest,
)

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Agrimit API",
    description="Precision agriculture AI backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# In-memory stores (replace with DB later)
# ---------------------------------------------------------------------------

_image_analyses: dict[str, list[ImageAnalysisResult]] = {}
_sensor_analyses: dict[str, SensorAnalysisResult] = {}
_advice_store: dict[str, AdviceResult] = {}


# ---------------------------------------------------------------------------
# Demo seed data
# ---------------------------------------------------------------------------

DEMO_FIELDS: list[FieldSummary] = [
    FieldSummary(
        id="F001",
        name="Kharif Plot A",
        location="Nashik, Maharashtra, India",
        cropType="Corn",
        lastStatus="yellow",
    ),
    FieldSummary(
        id="F002",
        name="Rabi Block 2",
        location="Pune, Maharashtra, India",
        cropType="Wheat",
        lastStatus="green",
    ),
    FieldSummary(
        id="F003",
        name="Summer Field East",
        location="Solapur, Maharashtra, India",
        cropType="Soybean",
        lastStatus="red",
    ),
]

DEMO_SENSOR_SERIES: dict[str, dict] = {
    "F001": {
        "soilMoisture": [42, 40, 38, 35, 33, 30, 28],
        "airTemp":      [27, 28, 29, 30, 31, 30, 29],
        "humidity":     [72, 74, 75, 76, 74, 73, 71],
        "leafWetness":  [55, 58, 60, 62, 60, 57, 54],
        "timestamps":   ["Day -6", "Day -5", "Day -4", "Day -3", "Day -2", "Day -1", "Today"],
    },
    "F002": {
        "soilMoisture": [60, 62, 61, 63, 65, 64, 62],
        "airTemp":      [22, 21, 23, 22, 24, 23, 22],
        "humidity":     [55, 54, 56, 55, 57, 56, 55],
        "leafWetness":  [30, 28, 32, 31, 33, 30, 29],
        "timestamps":   ["Day -6", "Day -5", "Day -4", "Day -3", "Day -2", "Day -1", "Today"],
    },
    "F003": {
        "soilMoisture": [20, 18, 17, 15, 14, 12, 10],
        "airTemp":      [34, 35, 36, 35, 37, 36, 38],
        "humidity":     [40, 38, 37, 35, 34, 33, 32],
        "leafWetness":  [20, 18, 17, 15, 14, 12, 10],
        "timestamps":   ["Day -6", "Day -5", "Day -4", "Day -3", "Day -2", "Day -1", "Today"],
    },
}

DEMO_IMAGE_ANALYSES: dict[str, list[ImageAnalysisResult]] = {
    "F001": [
        ImageAnalysisResult(
            fieldId="F001", cropType="Corn",
            timestamp="2026-03-30T08:00:00Z",
            classLabel="leaf_blight", confidence=0.84, severity="moderate",
        ),
        ImageAnalysisResult(
            fieldId="F001", cropType="Corn",
            timestamp="2026-03-28T09:15:00Z",
            classLabel="healthy", confidence=0.91, severity="mild",
        ),
    ],
    "F002": [
        ImageAnalysisResult(
            fieldId="F002", cropType="Wheat",
            timestamp="2026-03-29T07:30:00Z",
            classLabel="healthy", confidence=0.95, severity="mild",
        ),
    ],
    "F003": [
        ImageAnalysisResult(
            fieldId="F003", cropType="Soybean",
            timestamp="2026-03-31T06:45:00Z",
            classLabel="pest_damage", confidence=0.79, severity="severe",
        ),
        ImageAnalysisResult(
            fieldId="F003", cropType="Soybean",
            timestamp="2026-03-29T07:00:00Z",
            classLabel="nutrient_deficiency", confidence=0.68, severity="moderate",
        ),
    ],
}

DEMO_ADVICE: dict[str, AdviceResult] = {
    "F001": AdviceResult(
        fieldId="F001", timestamp="2026-03-30T10:00:00Z",
        overallStatus="yellow",
        alerts=["Leaf blight detected at moderate severity.", "Fungal risk is elevated due to high humidity."],
        actions=["Apply contact fungicide before next rain event.", "Remove affected lower leaves."],
        preventionTips=["Rotate with sorghum next season.", "Maintain crop canopy spacing."],
    ),
    "F003": AdviceResult(
        fieldId="F003", timestamp="2026-03-31T09:00:00Z",
        overallStatus="red",
        alerts=["Severe pest damage detected.", "Critical irrigation stress – soil moisture at 10%."],
        actions=["Irrigate immediately with 30 mm.", "Identify pest species and deploy targeted spray."],
        preventionTips=["Install pheromone traps for early detection.", "Use drip irrigation to conserve water."],
    ),
}

# Seed stores
for fid, analyses in DEMO_IMAGE_ANALYSES.items():
    _image_analyses[fid] = analyses[:]
for fid, advice in DEMO_ADVICE.items():
    _advice_store[fid] = advice


# ---------------------------------------------------------------------------
# Utility
# ---------------------------------------------------------------------------

def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _get_field(field_id: str) -> Optional[FieldSummary]:
    return next((f for f in DEMO_FIELDS if f.id == field_id), None)


# ---------------------------------------------------------------------------
# Routes – Demo data
# ---------------------------------------------------------------------------

@app.get("/api/demo/fields", response_model=list[FieldSummary])
def get_demo_fields():
    """Return list of all demo fields."""
    return DEMO_FIELDS


@app.get("/api/demo/field/{field_id}", response_model=FieldDetail)
def get_demo_field(field_id: str):
    """Return full detail for a single demo field."""
    field = _get_field(field_id)
    if not field:
        raise HTTPException(status_code=404, detail=f"Field '{field_id}' not found.")

    image_analyses = _image_analyses.get(field_id, DEMO_IMAGE_ANALYSES.get(field_id, []))
    last_advice    = _advice_store.get(field_id)
    sensor_series  = DEMO_SENSOR_SERIES.get(field_id, {})

    return FieldDetail(
        field=field,
        sensorSeries=sensor_series,
        imageAnalyses=image_analyses[:3],
        lastAdvice=last_advice,
    )


# ---------------------------------------------------------------------------
# Routes – Image analysis
# ---------------------------------------------------------------------------

@app.post("/api/analyze-image", response_model=ImageAnalysisResult)
async def analyze_image(
    image: UploadFile = File(...),
    cropType: str     = Form(...),
    fieldId: str      = Form(""),
):
    """Upload a crop image and run the CNN stub classifier."""
    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image file.")

    result = run_cnn_stub(image_bytes, cropType)

    analysis = ImageAnalysisResult(
        fieldId=fieldId or None,
        timestamp=_now_iso(),
        cropType=cropType,
        **result,
    )

    if fieldId:
        _image_analyses.setdefault(fieldId, []).insert(0, analysis)
        # Keep only the last 10 per field
        _image_analyses[fieldId] = _image_analyses[fieldId][:10]

    return analysis


# ---------------------------------------------------------------------------
# Routes – Sensor analysis
# ---------------------------------------------------------------------------

@app.post("/api/analyze-sensors", response_model=SensorAnalysisResult)
def analyze_sensors(req: SensorAnalysisRequest):
    """Analyse soil & weather sensor time-series and return risk levels."""
    result = analyze_time_series_stub(
        soil_moisture=req.soilMoisture,
        air_temp=req.airTemp,
        humidity=req.humidity,
        leaf_wetness=req.leafWetness,
    )

    sensor_analysis = SensorAnalysisResult(
        fieldId=req.fieldId,
        timestamp=_now_iso(),
        **result,
    )

    _sensor_analyses[req.fieldId] = sensor_analysis
    return sensor_analysis


# ---------------------------------------------------------------------------
# Routes – Fuse & Advise
# ---------------------------------------------------------------------------

@app.post("/api/fuse-and-advise", response_model=AdviceResult)
def fuse_and_advise(req: FuseAndAdviseRequest):
    """Fuse image + sensor analysis and generate agronomic advice."""
    health_vector = {
        "cropType":       req.cropType,
        "growthStage":    req.growthStage,
        "location":       req.location,
        **req.imageAnalysis,
        **req.sensorAnalysis,
    }

    advice_data = generate_advice_stub(health_vector)

    advice = AdviceResult(
        fieldId=req.fieldId,
        timestamp=_now_iso(),
        **advice_data,
    )

    _advice_store[req.fieldId] = advice

    # Update field's lastStatus
    for f in DEMO_FIELDS:
        if f.id == req.fieldId:
            f.lastStatus = advice.overallStatus
            break

    return advice


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.post("/api/chat")
async def chat_conversation(message_data: dict):
    """AI Chat for farmers - context-aware agronomy Q&A."""
    from ml_stubs import chat_llm_stub
    
    response = chat_llm_stub(
        message=message_data.get("message", ""),
        field_context=message_data.get("fieldContext", ""),
        language=message_data.get("language", "en")
    )
    
    return {"response": response}


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "Agrimit"}
