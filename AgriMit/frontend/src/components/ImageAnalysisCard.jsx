// ImageAnalysisCard – compact card for Expert view's image analysis list

const LABEL_STYLES = {
  healthy:              "bg-agri-green/15 text-agri-green",
  leaf_blight:          "bg-agri-red/15 text-agri-red",
  nutrient_deficiency:  "bg-agri-yellow/15 text-agri-yellow",
  pest_damage:          "bg-agri-orange/15 text-agri-orange",
  early_blight:         "bg-agri-red/15 text-agri-red",
  late_blight:          "bg-agri-red/15 text-agri-red",
  bacterial_spot:       "bg-agri-orange/15 text-agri-orange",
  tomato_mosaic_virus:  "bg-agri-purple/15 text-agri-purple",
};

const SEV_STYLES = {
  mild:     "bg-gray-100 text-gray-600",
  moderate: "bg-agri-orange/15 text-agri-orange",
  severe:   "bg-agri-red/15 text-agri-red",
};

export default function ImageAnalysisCard({ analysis }) {
  const a = analysis;

  return (
    <div className="card space-y-3 fade-up">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap gap-2 items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${LABEL_STYLES[a.classLabel] || "bg-gray-100 text-gray-600"}`}>
            {a.classLabel?.replace(/_/g, " ")}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${SEV_STYLES[a.severity] || ""}`}>
            {a.severity}
          </span>
        </div>
        <span className="text-xs text-gray-400">{new Date(a.timestamp).toLocaleString()}</span>
      </div>

      {/* Confidence bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Confidence</span>
          <span className="font-semibold">{(a.confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full bg-agri-leaf transition-all duration-700"
            style={{ width: `${(a.confidence * 100).toFixed(1)}%` }}
          />
        </div>
      </div>

      {a.precautions && a.precautions.length > 0 && (
        <>
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">🛡️ Precautions</p>
          <div className="space-y-1">
            {a.precautions.slice(0, 3).map((precaution, i) => (
              <div key={i} className="flex gap-2 bg-orange-50 border border-orange-200 rounded px-3 py-1 text-xs text-orange-800">
                <span className="text-orange-500 mt-0.5 flex-shrink-0">›</span>
                <span className="leading-relaxed">{precaution}</span>
              </div>
            ))}
            {a.precautions.length > 3 && (
              <p className="text-xs text-gray-500">+{a.precautions.length - 3} more...</p>
            )}
          </div>
        </>
      )}

      <p className="text-xs text-gray-400">Crop: {a.cropType}</p>
    </div>
  );
}

