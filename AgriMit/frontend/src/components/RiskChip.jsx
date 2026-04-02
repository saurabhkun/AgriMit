// RiskChip – compact chip for irrigation / fungal / pest risk levels
const RISK_STYLES = {
  low:    "bg-agri-green/10 text-agri-green border-agri-green/30",
  medium: "bg-agri-orange/10 text-agri-orange border-agri-orange/30",
  high:   "bg-agri-red/10 text-agri-red border-agri-red/30",
};

const RISK_ICONS = {
  low:    "✓",
  medium: "⚠",
  high:   "✕",
};

export default function RiskChip({ label, level, description }) {
  const style = RISK_STYLES[level] || RISK_STYLES.low;
  const icon  = RISK_ICONS[level]  || "•";

  return (
    <div className={`border rounded-xl p-3 ${style}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-bold">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        <span className={`ml-auto text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${style}`}>
          {level}
        </span>
      </div>
      {description && <p className="text-xs opacity-75 leading-relaxed">{description}</p>}
    </div>
  );
}
