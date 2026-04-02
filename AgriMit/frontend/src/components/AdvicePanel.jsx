import StatusBadge from "./StatusBadge";

export default function AdvicePanel({ advice }) {
  if (!advice) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">🤖 AI Precision Advice</h3>
          <p className="text-sm text-gray-600 font-medium capitalize">{advice.diagnosis || 'General Assessment'} ({advice.severity})</p>
        </div>
        <StatusBadge status={advice.overallStatus} size="lg" />
      </div>

      {advice.confidence && (
        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <p className="text-xs text-gray-600 mb-1 font-medium">Analysis Confidence</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="h-2 bg-agri-leaf rounded-full transition-all" style={{width: `${Math.round(advice.confidence * 100)}%`}} />
            </div>
            <span className="text-sm font-semibold text-gray-800 min-w-[50px] text-right">
              {Math.round(advice.confidence * 100)}%
            </span>
          </div>
        </div>
      )}

      {advice.alerts?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">⚠️ Alerts</p>
          <div className="space-y-2">
            {advice.alerts.map((alert, i) => (
              <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                {alert}
              </div>
            ))}
          </div>
        </div>
      )}

      {advice.actions?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-agri-leaf uppercase tracking-wide mb-2">✅ Immediate Actions</p>
          <ol className="space-y-2">
            {advice.actions.map((action, i) => (
              <li key={i} className="flex gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <span className="font-bold text-agri-dark w-6 flex-shrink-0 text-center">{i + 1}.</span>
                <span className="text-sm leading-relaxed">{action}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {advice.preventionTips?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">💡 Prevention Tips</p>
          <div className="space-y-2">
            {advice.preventionTips.map((tip, i) => (
              <div key={i} className="flex gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">›</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {advice.precautions?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">🛡️ Disease Precautions</p>
          <div className="space-y-2">
            {advice.precautions.map((precaution, i) => (
              <div key={i} className="flex gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
                <span className="text-orange-500 mt-0.5 flex-shrink-0">›</span>
                <span>{precaution}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t">
{advice.pesticides?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">🛡️ Pesticides Available</p>
            <div className="space-y-2">
              {advice.pesticides.map((p, i) => (
                <div key={i} className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
                  <div className="font-semibold">{p.name} ({p.unit})</div>
                  <div className="text-orange-700 font-bold">₹{p.price}</div>
                  <div className="text-xs text-gray-500">{p.shops.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {advice.nutrients?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">🌱 Nutrients/Fertilizers</p>
            <div className="space-y-2">
              {advice.nutrients.map((n, i) => (
                <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                  <div className="font-semibold">{n.name} ({n.unit})</div>
                  <div className="text-green-700 font-bold">₹{n.price}</div>
                  <div className="text-xs text-gray-500">{n.shops.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {advice.localShops?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">🏪 Local Agri Shops</p>
          <div className="space-y-1">
            {advice.localShops.map((shop, i) => (
              <div key={i} className="bg-purple-50 border border-purple-200 rounded px-3 py-2 text-xs text-purple-800 font-medium">
                {shop}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 mt-4 border-t text-xs text-gray-500 text-center font-medium">
        AgriMit AI Precision Assistant
      </div>
    </div>
  );
}

