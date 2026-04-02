"""
schemas.py
----------
Pydantic models for request / response validation.
"""

from typing import Optional, List
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Shared / reusable types
# ---------------------------------------------------------------------------

class FieldSummary(BaseModel):
    id: str
    name: str
    location: str
    cropType: str
    lastStatus: str  # "green" | "yellow" | "red" | "unknown"


class ImageAnalysisResult(BaseModel):
    fieldId: Optional[str] = None
    timestamp: str
    classLabel: str
    confidence: float
    severity: str         # "mild" | "moderate" | "severe"
    cropType: str


class SensorAnalysisResult(BaseModel):
    fieldId: str
    timestamp: str
    irrigationRisk: str   # "low" | "medium" | "high"
    fungalRisk: str
    pestRisk: str
    avgSoilMoisture: float
    avgAirTemp: float
    avgHumidity: float
    avgLeafWetness: float


class AdviceResult(BaseModel):
    fieldId: str
    timestamp: str
    overallStatus: str    # "green" | "yellow" | "red"
    alerts: List[str]
    actions: List[str]
    preventionTips: List[str]
    precautions: List[str]
    pesticides: List[dict]
    nutrients: List[dict]
    localShops: List[str]


class FieldDetail(BaseModel):
    field: FieldSummary
    sensorSeries: dict            # raw time-series for display
    imageAnalyses: List[ImageAnalysisResult]
    lastAdvice: Optional[AdviceResult] = None


# ---------------------------------------------------------------------------
# Request bodies
# ---------------------------------------------------------------------------

class SensorAnalysisRequest(BaseModel):
    fieldId: str
    soilMoisture: List[float] = Field(..., min_length=1)
    airTemp: List[float]      = Field(..., min_length=1)
    humidity: List[float]     = Field(..., min_length=1)
    leafWetness: List[float]  = Field(..., min_length=1)


class FuseAndAdviseRequest(BaseModel):
    fieldId: str
    cropType: str
    growthStage: str
    location: str
    imageAnalysis: dict   # ImageAnalysisResult as dict
    sensorAnalysis: dict  # SensorAnalysisResult as dict
