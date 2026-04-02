import { useState, useEffect } from "react";
import { api } from "../api";
import RiskChip from "./RiskChip";

export default function SensorAnalysis({ fieldId, demoPayload, onResult }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Auto-generated sensor values - no user input
  const [moisture, setMoisture] = useState(55);
  const [temp, setTemp] = useState(28);
  const [humidity, setHumidity] = useState(65);
  const [wetness, setWetness] = useState(42);

  // Smooth auto-updates every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMoisture(prev => {
        const change = (Math.random() - 0.5) * 3;
        return Math.max(30, Math.min(80, Math.round(prev + change)));
      });
      setTemp(prev => {
        const change = (Math.random() - 0.5) * 2 + 0.1; // Slight daily rise bias
        return Math.max(20, Math.min(40, Math.round(prev + change * 10) / 10));
      });
      setHumidity(prev => {
        const change = (Math.random() - 0.5) * 4;
        return Math.max(30, Math.min(90, Math.round(prev + change)));
      });
      setWetness(prev => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(20, Math.min(100, Math.round(prev + change)));
      });
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  async function handleAnalyze() {
    setLoading(true);
    setError("");
    try {
      const payload = {
        fieldId,
        soilMoisture: Array(7).fill().map((_, i) => Math.max(30, Math.min(80, moisture + (Math.random() - 0.5) * 10 * i))),
        airTemp: Array(7).fill().map((_, i) => Math.max(20, Math.min(40, temp + (Math.random() - 0.5) * 3 * i))),
        humidity: Array(7).fill().map((_, i) => Math.max(30, Math.min(90, humidity + (Math.random() - 0.5) * 8 * i))),
        leafWetness: Array(7).fill().map((_, i) => Math.max(20, Math.min(100, wetness + (Math.random() - 0.5) * 12 * i))),
        timestamps: ["-6d", "-5d", "-4d", "-3d", "-2d", "-1d", "Today"]
      };
      const data = await api.analyzeSensors(payload);
      setResult(data);
      onResult?.(data);
    } catch (e) {
      setError("Analysis failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Live sensor display (no input) */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 space-y-3 border border-blue-100">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-200 px-3 py-1 rounded-full inline-flex items-center gap-1 w-fit">
          📡 LIVE SENSORS
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="text-lg">💧</span> Soil Moisture
            </p>
            <div className="flex items-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000" style={{width: `${(moisture-30)/(80-30)*100}%`}} />
              </div>
              <span className="font-mono font-bold text-lg text-gray-800 min-w-[36px] text-right">{moisture}%</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="text-lg">🌡️</span> Temperature
            </p>
            <div className="flex items-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000" style={{width: `${(temp-20)/(40-20)*100}%`}} />
              </div>
              <span className="font-mono font-bold text-lg text-gray-800 min-w-[36px] text-right">{temp}°C</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="text-lg">💨</span> Humidity
            </p>
            <div className="flex items-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-1000" style={{width: `${(humidity-30)/(90-30)*100}%`}} />
              </div>
              <span className="font-mono font-bold text-lg text-gray-800 min-w-[36px] text-right">{humidity}%</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="text-lg">🍃</span> Leaf Wetness
            </p>
            <div className="flex items-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000" style={{width: `${(wetness-20)/(100-20)*100}%`}} />
              </div>
              <span className="font-mono font-bold text-lg text-gray-800 min-w-[36px] text-right">{wetness}%</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center opacity-75">
          🔄 Auto-updating every 7 seconds • Realistic sensor simulation
        </p>
      </div>

      {/* Analyze button */}
      <button
        className="btn-primary w-full"
        disabled={loading}
        onClick={handleAnalyze}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="spinner w-4 h-4" />
            Analysing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            📊
            Analyze Sensors
          </span>
        )}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 fade-up">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 mb-3 bg-emerald-200 px-3 py-1 rounded-full inline-block">
            ✅ Risk Assessment Complete
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <RiskChip 
              label="Irrigation" 
              level={result.irrigationRisk} 
              description={`Soil moisture avg ${result.avgSoilMoisture?.toFixed(1)}%`} 
            />
            <RiskChip 
              label="Fungal Disease" 
              level={result.fungalRisk} 
              description={`Humidity avg ${result.avgHumidity?.toFixed(1)}%`} 
            />
            <RiskChip 
              label="Pest Risk" 
              level={result.pestRisk} 
              description={`Leaf wetness avg ${result.avgLeafWetness?.toFixed(1)}%`} 
            />
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-200 text-xs text-gray-600 space-y-1">
            <p><span className="font-semibold">Avg Temperature:</span> {result.avgAirTemp?.toFixed(1)}°C</p>
            <p><span className="font-semibold">Analyzed:</span> {new Date(result.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

