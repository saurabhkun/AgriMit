// StatusBadge – shows green / yellow / red overall field health
export default function StatusBadge({ status, size = "md" }) {
  const cfg = {
    green:   { bg: "bg-agri-green/15 text-agri-green border-agri-green/30",  dot: "bg-agri-green",  label: "Healthy"  },
    yellow:  { bg: "bg-agri-yellow/15 text-agri-yellow border-agri-yellow/30", dot: "bg-agri-yellow", label: "Caution" },
    red:     { bg: "bg-agri-red/15 text-agri-red border-agri-red/30",     dot: "bg-agri-red",   label: "Critical" },
    unknown: { bg: "bg-gray-100 text-gray-500 border-gray-200",            dot: "bg-gray-400",   label: "Unknown"  },
  };
  const { bg, dot, label } = cfg[status] || cfg.unknown;
  const textSize = size === "lg" ? "text-base font-bold px-5 py-2" : "text-xs font-semibold px-3 py-1";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border ${bg} ${textSize}`}>
      <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
      {label}
    </span>
  );
}
