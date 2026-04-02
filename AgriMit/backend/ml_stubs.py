"""
ml_stubs.py
-----------
Stub implementations of all ML/AI functions.

Each function has a clear interface and docstring describing:
  - What real inputs/outputs look like
  - Where a real model would be plugged in
"""

import random
import statistics


# ---------------------------------------------------------------------------
# 1. CNN Image Classification Stub
# ---------------------------------------------------------------------------

def run_cnn_stub(image_bytes: bytes, crop_type: str) -> dict:
    """
    Stub for a CNN-based crop disease classifier.

    Real implementation would:
      - Resize image to 224x224
      - Normalise with ImageNet mean/std
      - Pass through a fine-tuned EfficientNet / ResNet-50
      - Pick argmax over [healthy, leaf_blight, nutrient_deficiency, pest_damage]

    Args:
        image_bytes: Raw image bytes (JPEG/PNG from drone or phone).
        crop_type:   e.g. "Corn", "Wheat", "Rice", "Soybean"

    Returns:
        dict with classLabel, confidence, severity
    """

    # --- STUB LOGIC ---
    # Seed randomness lightly on image size so repeated uploads feel consistent
    random.seed(len(image_bytes) % 997)

    if crop_type.lower() == "tomato":
        labels = ["healthy", "early_blight", "late_blight", "bacterial_spot", "tomato_mosaic_virus"]
        weights = [0.40, 0.20, 0.20, 0.10, 0.10]  # Prioritize tomato diseases
    else:
        labels = ["healthy", "leaf_blight", "nutrient_deficiency", "pest_damage"]
        weights = [0.40, 0.25, 0.20, 0.15]
    class_label = random.choices(labels, weights=weights, k=1)[0]

    # Confidence varies by class
    confidence_ranges = {
        "healthy":              (0.75, 0.97),
        "leaf_blight":          (0.60, 0.92),
        "nutrient_deficiency":  (0.55, 0.88),
        "pest_damage":          (0.50, 0.85),
        "early_blight":         (0.65, 0.93),
        "late_blight":          (0.62, 0.91),
        "bacterial_spot":       (0.58, 0.89),
        "tomato_mosaic_virus":  (0.55, 0.87),
    }
    lo, hi = confidence_ranges[class_label]
    confidence = round(random.uniform(lo, hi), 3)

    # Severity is irrelevant for healthy
    if class_label == "healthy":
        severity = "mild"
    else:
        severity = random.choices(
            ["mild", "moderate", "severe"],
            weights=[0.4, 0.4, 0.2],
            k=1
        )[0]

    return {
        "classLabel": class_label,
        "confidence": confidence,
        "severity": severity,
    }


# ---------------------------------------------------------------------------
# 2. Sensor Time-Series Analysis Stub
# ---------------------------------------------------------------------------

def analyze_time_series_stub(
    soil_moisture: list[float],
    air_temp: list[float],
    humidity: list[float],
    leaf_wetness: list[float],
) -> dict:
    """
    Stub for a time-series risk classifier.

    Real implementation would:
      - Extract hand-crafted features (μ, σ, trend slope, autocorrelation)
      - OR pass rolling windows through an LSTM / Transformer
      - Classify irrigationRisk, fungalRisk, pestRisk

    Returns:
        dict with irrigationRisk, fungalRisk, pestRisk  each "low" | "medium" | "high"
    """

    def _risk(value: float, low_threshold: float, high_threshold: float) -> str:
        """Simple threshold classifier."""
        if value <= low_threshold:
            return "low"
        if value <= high_threshold:
            return "medium"
        return "high"

    # --- STUB LOGIC ---
    avg_moisture = statistics.mean(soil_moisture) if soil_moisture else 50.0
    avg_temp     = statistics.mean(air_temp)      if air_temp     else 25.0
    avg_humidity = statistics.mean(humidity)       if humidity     else 60.0
    avg_wetness  = statistics.mean(leaf_wetness)  if leaf_wetness else 40.0

    # Irrigation risk: low moisture → higher irrigation need
    # Invert: high moisture = low risk
    irrigation_score = 100 - avg_moisture          # 0‒100, higher = drier
    irrigation_risk  = _risk(irrigation_score, 30, 60)

    # Fungal risk: driven by humidity + leaf wetness + moderate temperature
    fungal_score = (avg_humidity * 0.5) + (avg_wetness * 0.3) + (max(0, 30 - abs(avg_temp - 22)) * 0.2)
    fungal_risk  = _risk(fungal_score, 40, 65)

    # Pest risk: warm & dry conditions favour pests
    pest_score = (avg_temp * 1.5) - (avg_humidity * 0.3) + (avg_wetness * 0.1)
    pest_risk  = _risk(pest_score, 25, 38)

    return {
        "irrigationRisk": irrigation_risk,
        "fungalRisk":     fungal_risk,
        "pestRisk":       pest_risk,
        # Rounded averages for display
        "avgSoilMoisture": round(avg_moisture, 1),
        "avgAirTemp":      round(avg_temp, 1),
        "avgHumidity":     round(avg_humidity, 1),
        "avgLeafWetness":  round(avg_wetness, 1),
    }


# ---------------------------------------------------------------------------
# 3. Fusion + Advice Generation Stub
# ---------------------------------------------------------------------------

import random

def chat_llm_stub(message: str, field_context: str = '', language: str = 'en') -> str:
    """
    Stub for farmer Q&A chatbot.
    
    Real implementation: 
    - Inject field_context + chat history
    - Send to multilingual agri-LLM
    - Return natural language response
    
    Args:
        message: Farmer question
        field_context: Current field state summary
        language: 'en'|'hi'|'mr'|'...
    """
    
    context = field_context or "No field context available."
    
    responses = {
        'en': [
            "Based on " + context + ", your question '" + message + "' suggests checking soil moisture first. Would you like irrigation recommendations?",
            "Regarding '" + message + "' in context of " + context + " - I recommend scouting tomorrow morning.",
            "For your query '" + message + "': With the current field conditions " + context + ", apply foliar spray if symptoms confirm.",
            "Great question! For general crop management, ensure optimal irrigation and scout weekly.",
            "In " + context + ", '" + message + "' - maintain pH 6.5-7.5 for best nutrient uptake."
        ],
        'hi': [
            context + " के आधार पर '" + message + "' - सबसे पहले मिट्टी की नमी जांचें। क्या आप सिंचाई सलाह चाहते हैं?",
            "'" + message + "' के संदर्भ में " + context + " - कल सुबह निरीक्षण करें।",
            context + " में '" + message + "' - लक्षणों की पुष्टि होने पर पर्ण स्प्रे करें।",
            "अच्छा प्रश्न! फसल प्रबंधन के लिए इष्टतम सिंचाई सुनिश्चित करें।"
        ]
    }
    
    lang_responses = responses.get(language, responses['en'])
    return random.choice(lang_responses)


def generate_advice_stub(field_health_vector: dict) -> dict:
    """
    ENHANCED Stub for LLM-powered agronomic advice with structured prompt.
    
    LLM Prompt Template:
    ```
    You are an expert agronomist. Analyze this field health vector and provide precise recommendations.
    
    FIELD CONTEXT:
    - Crop: {cropType}
    - Growth Stage: {growthStage}
    - Location: {location} 
    - Season Context: Kharif/Rabi (inferred from location + stage)
    
    IMAGE MODEL KEY FINDINGS:
    - Detection: {classLabel} (confidence: {confidence}, severity: {severity})
    
    SENSOR MODEL KEY FINDINGS:
    - Irrigation Risk: {irrigationRisk} (soil moisture avg: {avgSoilMoisture}%)
    - Fungal Risk: {fungalRisk} (humidity: {avgHumidity}%, leaf wetness: {avgLeafWetness}%)
    - Pest Risk: {pestRisk} (temp: {avgAirTemp}°C)
    
    Generate JSON response with:
    1. overallStatus: "green"|"yellow"|"red"
    2. alerts: 1-3 bullet points (urgent issues only)
    3. actions: 2-4 specific interventions (with timing/quantity)
    4. preventionTips: 2-3 long-term strategies
    ```
    
    Real implementation: Send formatted prompt to Grok/Llama3 via LiteLLM or vLLM.
    \"\"\"


    # --- STUB LOGIC ---
    severity      = field_health_vector.get("severity", "mild")
    irr_risk      = field_health_vector.get("irrigationRisk", "low")
    fungal_risk   = field_health_vector.get("fungalRisk", "low")
    pest_risk     = field_health_vector.get("pestRisk", "low")
    class_label   = field_health_vector.get("classLabel", "healthy")
    crop_type     = field_health_vector.get("cropType", "Crop")
    growth_stage  = field_health_vector.get("growthStage", "Vegetative")

    # Compute a risk score (0-12)
    risk_map = {"low": 0, "medium": 2, "high": 4}
    sev_map  = {"mild": 0, "moderate": 2, "severe": 4}

    score = (
        risk_map.get(irr_risk, 0)
        + risk_map.get(fungal_risk, 0)
        + risk_map.get(pest_risk, 0)
        + sev_map.get(severity, 0)
    )

    if score <= 3:
        overall_status = "green"
    elif score <= 7:
        overall_status = "yellow"
    else:
        overall_status = "red"

    # ---- Build contextual alerts ----
    alerts = []
    if irr_risk in ("medium", "high"):
        alerts.append(
            f"{'Moderate' if irr_risk == 'medium' else 'High'} irrigation stress detected. "
            f"Soil moisture is below optimal for {crop_type} at {growth_stage} stage."
        )
    if fungal_risk in ("medium", "high"):
        alerts.append(
            f"{'Elevated' if fungal_risk == 'medium' else 'High'} fungal risk. "
            "Humidity and leaf wetness combination is favourable for disease spread."
        )
    if pest_risk in ("medium", "high"):
        alerts.append(
            f"Pest pressure is {'moderate' if pest_risk == 'medium' else 'high'}. "
            "Temperature conditions are within the optimal range for common pests."
        )
    if class_label != "healthy":
        label_readable = class_label.replace("_", " ").title()
        alerts.append(
            f"Image analysis detected {label_readable} with {severity} severity. "
            "Immediate scouting recommended."
        )
    if not alerts:
        alerts.append("All field parameters are within normal range. No immediate concerns.")

    # ---- Build recommended actions ----
    actions = []
    if irr_risk == "high":
        actions.append(f"Apply irrigation within 24 hours – target 25–30 mm for {crop_type}.")
    elif irr_risk == "medium":
        actions.append("Schedule a soil moisture check; irrigate if below 40 % field capacity.")

    if fungal_risk == "high":
        actions.append("Apply a registered fungicide. Spray in early morning or late evening.")
    elif fungal_risk == "medium":
        actions.append("Inspect for early fungal symptoms; prepare a contact fungicide.")

    if pest_risk == "high":
        actions.append("Deploy pheromone traps and scout infested areas. Consider targeted spray.")
    elif pest_risk == "medium":
        actions.append("Increase scouting frequency to twice per week for pest monitoring.")

    if class_label == "leaf_blight":
        actions.append("Remove and destroy heavily infected leaves to reduce sporulation.")
    elif class_label == "nutrient_deficiency":
        actions.append("Conduct a tissue test and apply balanced NPK fertiliser as corrective measure.")
    elif class_label == "pest_damage":
        actions.append("Identify pest species before selecting pesticide to avoid resistance build-up.")

    if not actions:
        actions.append("Continue current management practices and monitor weekly.")

    # ---- Prevention tips ----
    # Disease-specific precautions
    DISEASE_PRECAUTIONS = {
        "leaf_blight": [
            "Apply Mancozeb or Chlorothalonil (2g/liter water) every 7-10 days.",
            "Remove and burn infected leaves to prevent spore spread.",
            "Avoid overhead irrigation; use drip to keep foliage dry.",
            "Apply 2% Potassium Phosphite as resistance inducer."
        ],
        "nutrient_deficiency": [
            "Soil test for NPK levels; apply Urea (50kg/ha) if Nitrogen deficient.",
            "Foliar spray 2% DAP (Diammonium Phosphate) for quick Phosphorus fix.",
            "Add Gypsum (500kg/ha) for Calcium deficiency symptoms.",
            "Micro-nutrient mix with Zinc Sulphate (0.5%) weekly."
        ],
        "pest_damage": [
            "Identify pest (aphid/armyworm); use Imidacloprid 17.8SL (0.3ml/liter).",
            "Install yellow sticky traps @ 20/acre for early detection.",
            "Neem oil 3% spray 2x/week as organic option.",
            "Apply Spinosad 2.5SC for lepidopteran pests."
        ],
        "early_blight": [
            "Foliar spray Difenoconazole + Propiconazole (1ml/liter) 2x at 10-day interval.",
            "Apply Copper Oxychloride 50WP (3g/liter) preventively.",
            "Remove lower infected leaves and mulch to reduce soil splash.",
            "Potassium rich fertilizer to boost plant resistance."
        ],
        "late_blight": [
            "Immediate application of Ridomil Gold MZ 68WP (2.5g/liter).",
            "Alternate with Mancozeb (2g/liter) to prevent resistance.",
            "Wide row spacing and prune lower leaves for air circulation.",
            "Monitor weather: spray before prolonged wet periods."
        ],
        "bacterial_spot": [
            "Copper-based bactericide (Kocide 101, 3g/liter) every 7 days.",
            "Streptocycline (0.5g + Copper 3g)/10L water at first spot.",
            "Avoid overhead irrigation; use drip only.",
            "Use disease-free seeds and rotate with non-solanaceous crops."
        ],
        "tomato_mosaic_virus": [
            "Control whitefly vectors with Acetamiprid (0.5g/liter).",
            "Remove and destroy infected plants immediately.",
            "Use reflective mulches to repel virus vectors.",
            "Plant resistant varieties like Arka Rakshak/Abhijit."
        ]
    }

    precautions = DISEASE_PRECAUTIONS.get(class_label, ["Continue standard monitoring."])

    # Market info based on disease & location
    MARKET_INFO = {
        "pesticides": [
            {"name": "Mancozeb 75WP", "price": 350, "unit": "500g", "shops": ["Krishi Kendra (Nashik)", "Agro Mart (Pune)", "Shree Ram Agri (Solapur)"]},
            {"name": "Difenoconazole 25EC", "price": 1250, "unit": "250ml", "shops": ["Green Farm Supplies (Nashik)", "Pawan Pesticides (Pune)"]},
            {"name": "Imidacloprid 17.8SL", "price": 850, "unit": "100ml", "shops": ["Maharashtra Agro (Nashik)", "Solapur Seed Store"]},
        ],
        "nutrients": [
            {"name": "Urea 46-00", "price": 242, "unit": "50kg", "shops": ["All local co-ops"]},
            {"name": "DAP 18-46-0", "price": 1350, "unit": "50kg", "shops": ["Krishi Kendra", "Local Fertilizer Depot"]},
            {"name": "19-19-19 NPK", "price": 1450, "unit": "50kg", "shops": ["Agro Mart"]},
        ],
        "localShops": [
            "Krishi Kendra, Nashik Main Market (Mob: 98765-43210)",
            "Agro Mart, Pune Station Road (Mob: 98765-43211)",
            "Shree Ram Agri Inputs, Solapur MIDC (Mob: 98765-43212)",
            "Maharashtra Agro Care, All locations"
        ]
    }

    return {
        "overallStatus":   overall_status,
        "alerts":          alerts,
        "actions":         actions,
        "preventionTips":  prevention_tips,
        "precautions":     precautions,
        "pesticides":      MARKET_INFO["pesticides"],
        "nutrients":       MARKET_INFO["nutrients"],
        "localShops":      MARKET_INFO["localShops"],
    }
