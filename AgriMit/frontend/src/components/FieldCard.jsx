import StatusBadge from "./StatusBadge";

// Crop type emoji map
const CROP_ICONS = {
  Corn: "🌽", Wheat: "🌾", Rice: "🍚", Soybean: "🫘",
  Cotton: "🌿", Tomato: "🍅",
};

export default function FieldCard({ field, selected, onClick }) {
  const icon = CROP_ICONS[field.cropType] || "🌱";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left card transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        selected ? "ring-2 ring-agri-leaf shadow-md" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="font-semibold text-gray-800 leading-tight">{field.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{field.cropType} · {field.location}</p>
          </div>
        </div>
        <StatusBadge status={field.lastStatus} />
      </div>
    </button>
  );
}
