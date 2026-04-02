import { useState, useEffect } from "react";
import { api } from "../api";
import FieldCard from "./FieldCard";
import StatusBadge from "./StatusBadge";
import ImageUpload from "./ImageUpload";
import SensorAnalysis from "./SensorAnalysis";
import AdvicePanel from "./AdvicePanel";
// ChatBot temporarily disabled - use public/chatbot-demo.html
import FarmMap from "./FarmMap";
import SimpleChatBot from "./SimpleChatBot";
import SensorGraphs from "./SensorGraphs";
import MarketTab from "./MarketTab";
import AdvancedChatBot from "./AdvancedChatBot";

export default function FarmerView({ selectedFieldId }) {
  // ── State ──────────────────────────────────────────────
  const [fields, setFields]             = useState([]);
  const [fieldsLoading, setFieldsLoad]  = useState(true);
  const [fieldsError, setFieldsError]   = useState("");
  const [selectedId, setSelectedId]     = useState(null);

  const [imageResult, setImageResult]     = useState(null);
  const [sensorResult, setSensorResult]   = useState(null);

  const [advice, setAdvice]               = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [adviceError, setAdviceError]     = useState("");

  // ── Load fields on mount ───────────────────────────────
  useEffect(() => {
    setFieldsLoad(true);
    api.getFields()
      .then((data) => { setFields(data); if (data.length) setSelectedId(data[0].id); })
      .catch((e) => setFieldsError(e.message))
      .finally(() => setFieldsLoad(false));
  }, []);

  const selectedField = fields.find((f) => f.id === selectedId);

  // ── Demo sensor payload ────────────────────────────────
  const DEMO_SENSORS = {
    F001: { 
      soilMoisture: [42,40,38,35,33,30,28], 
      ph: [6.8,6.9,7.0,6.7,6.5,6.4,6.3],
      airTemp: [27,28,29,30,31,30,29], 
      humidity: [72,74,75,76,74,73,71], 
      leafWetness: [55,58,60,62,60,57,54],
      timestamps: ["D-6","D-5","D-4","D-3","D-2","D-1","Today"]
    },
    F002: { 
      soilMoisture: [60,62,61,63,65,64,62], 
      ph: [7.1,7.0,7.2,7.1,6.9,7.0,6.8],
      airTemp: [22,21,23,22,24,23,22], 
      humidity: [55,54,56,55,57,56,55], 
      leafWetness: [30,28,32,31,33,30,29],
      timestamps: ["D-6","D-5","D-4","D-3","D-2","D-1","Today"]
    },
    F003: { 
      soilMoisture: [20,18,17,15,14,12,10], 
      ph: [5.9,5.8,5.7,5.6,5.5,5.4,5.3],
      airTemp: [34,35,36,35,37,36,38], 
      humidity: [40,38,37,35,34,33,32], 
      leafWetness: [20,18,17,15,14,12,10],
      timestamps: ["D-6","D-5","D-4","D-3","D-2","D-1","Today"]
    },
  };

  // ── Fuse & advise ──────────────────────────────────────
  async function handleAdvise() {
    if (!selectedField) return;
    setAdviceLoading(true);
    setAdviceError("");
    try {
      const payload = {
        fieldId:        selectedField.id,
        cropType:       selectedField.cropType,
        growthStage:    "vegetative",
        location:       selectedField.location,
        imageAnalysis:  imageResult || { classLabel: "healthy", confidence: 0.9, severity: "mild" },
        sensorAnalysis: sensorResult || { irrigationRisk: "low", fungalRisk: "low", pestRisk: "low", avgSoilMoisture: 50, avgAirTemp: 28, avgHumidity: 60, avgLeafWetness: 40 },
      };
      const data = await api.fuseAndAdvise(payload);
      setAdvice(data);
    } catch (e) {
      setAdviceError("Could not generate advice — " + e.message);
    } finally {
      setAdviceLoading(false);
    }
  }

  // Reset analysis results when field changes
  useEffect(() => {
    setImageResult(null);
    setSensorResult(null);
    setAdvice(null);
    setAdviceError("");
  }, [selectedId]);

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="space-y-8 fade-up">
        <AdvancedChatBot fieldName={selectedField?.name} fieldData={selectedField} />



      {/* ─── Section 1: Interactive GPS Map ─── */}
      <section>
        <h2 className="section-title">🗺️ Farm Map & Selection</h2>
        <FarmMap 
          fields={fields} 
          selectedId={selectedId}
          onFieldSelect={setSelectedId}
        />
      </section>

      {/* Field list removed - satellite map only */}

      {/* ─── Selected field summary ─── */}
      {selectedField && (
        <section className="card flex items-center justify-between flex-wrap gap-4 fade-up">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Active Field</p>
            <h3 className="text-xl font-bold text-gray-800">{selectedField.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedField.cropType} · {selectedField.location}
            </p>
          </div>
          <StatusBadge status={selectedField.lastStatus} size="lg" />
        </section>
      )}

      {/* ─── Section 2 & 3: Image + Sensor side by side ─── */}
      {selectedField && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image upload */}
          <section>
            <h2 className="section-title">📸 Upload Crop Image</h2>
            <div className="card">
              <ImageUpload
                fieldId={selectedField.id}
                cropType={selectedField.cropType}
                onResult={setImageResult}
              />
            </div>
          </section>

          {/* Sensor analysis */}
<section>
            <h2 className="section-title">🌡 Soil & Weather Analysis</h2>
            <div className="card">
              <SensorAnalysis
                fieldId={selectedField.id}
                demoPayload={DEMO_SENSORS[selectedField.id] || DEMO_SENSORS.F001}
                onResult={setSensorResult}
              />
            </div>
            <div className="card mt-4">
              <SensorGraphs 
                sensorData={DEMO_SENSORS[selectedField.id] || DEMO_SENSORS.F001} 
                fieldId={selectedField.id} 
              />
            </div>
          </section>
        </div>
      )}

      {/* ─── Section 4: AI Advice ─── */}
      {selectedField && (
        <section>
          <h2 className="section-title">🤖 AI-Powered Advice</h2>
          <div className="space-y-4">
            <button
              className="btn-primary"
              disabled={adviceLoading}
              onClick={handleAdvise}
            >
              {adviceLoading ? <span className="spinner" /> : "⚡"}
              {adviceLoading ? "Generating advice…" : "Generate Advice"}
            </button>

            {adviceError && (
              <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{adviceError}</p>
            )}

            <AdvicePanel advice={advice} />
          </div>
        </section>
      )}

      <section>
        <h2 className="section-title">🛒 Local Market & Shops</h2>
        <MarketTab />
      </section>
    </div>
  );
}


