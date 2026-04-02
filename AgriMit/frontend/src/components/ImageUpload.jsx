import { useState } from "react";
import { api } from "../api";

const CROP_OPTIONS = ["Corn", "Wheat", "Rice", "Soybean", "Cotton", "Tomato"];

const LABEL_STYLES = {
  healthy:              "bg-agri-green/15 text-agri-green",
  leaf_blight:          "bg-agri-red/15 text-agri-red",
  nutrient_deficiency:  "bg-agri-yellow/15 text-agri-yellow",
  pest_damage:          "bg-agri-orange/15 text-agri-orange",
};

const SEV_STYLES = {
  mild:     "bg-gray-100 text-gray-600",
  moderate: "bg-agri-orange/15 text-agri-orange",
  severe:   "bg-agri-red/15 text-agri-red",
};

export default function ImageUpload({ fieldId, cropType: defaultCrop, onResult }) {
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [cropType, setCropType]   = useState(defaultCrop || "Corn");
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState("");

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { setError("Please select an image first."); return; }
    setLoading(true); setError("");
    try {
      const data = await api.analyzeImage(file, cropType, fieldId);
      setResult(data);
      onResult?.(data);
    } catch (err) {
      setError("Analysis failed – " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Crop type select */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Crop Type</label>
          <select
            value={cropType}
            onChange={e => setCropType(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agri-leaf"
          >
            {CROP_OPTIONS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* File input */}
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-agri-leaf transition-colors"
          onClick={() => document.getElementById("img-input").click()}
        >
          {preview
            ? <img src={preview} alt="preview" className="mx-auto h-32 object-contain rounded-lg" />
            : <div className="text-gray-400 space-y-1">
                <p className="text-3xl">🖼️</p>
                <p className="text-sm font-medium">Click to upload crop image</p>
                <p className="text-xs">JPEG, PNG – drone or phone photo</p>
              </div>
          }
          <input id="img-input" type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        <button type="submit" disabled={loading || !file} className="btn-primary w-full justify-center">
          {loading ? <span className="spinner" /> : "🔍"}
          {loading ? "Analysing…" : "Analyse Image"}
        </button>
      </form>

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{error}</p>}

      {/* Result card */}
      {result && (
        <div className="card fade-up space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="font-semibold text-gray-700">Analysis Result</p>
            <span className="text-xs text-gray-400">{new Date(result.timestamp).toLocaleString()}</span>
          </div>

          {/* Label */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${LABEL_STYLES[result.classLabel] || "bg-gray-100 text-gray-600"}`}>
              {result.classLabel.replace(/_/g, " ")}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${SEV_STYLES[result.severity] || ""}`}>
              {result.severity} severity
            </span>
          </div>

          {/* Confidence bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Confidence</span>
              <span className="font-semibold">{(result.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full bg-agri-leaf transition-all duration-700"
                style={{ width: `${(result.confidence * 100).toFixed(1)}%` }}
              />
            </div>
          </div>

          {/* Precautions */}
          {result.precautions && result.precautions.length > 0 && (
            <>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2 mt-4">🛡️ Precautions</p>
              <div className="space-y-1">
                {result.precautions.slice(0, 3).map((precaution, i) => (
                  <div key={i} className="flex gap-2 bg-orange-50 border border-orange-200 rounded px-3 py-1 text-xs text-orange-800">
                    <span className="text-orange-500 mt-0.5 flex-shrink-0">›</span>
                    <span className="leading-relaxed">{precaution}</span>
                  </div>
                ))}
                {result.precautions.length > 3 && (
                  <p className="text-xs text-gray-500">+{result.precautions.length - 3} more...</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
