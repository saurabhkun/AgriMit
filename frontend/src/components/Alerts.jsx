import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Droplets, ThermometerSun, Leaf, Bug } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const MOCK_ALERTS = {
  F001: [
    { id: 1, type: 'irrigation', message: 'Low soil moisture detected (28%) - irrigation recommended within 24h', severity: 'high', timestamp: '2026-01-04T14:30:00Z' },
    { id: 2, type: 'temperature', message: 'High temperature alert (36°C) - monitor heat stress on crops', severity: 'medium', timestamp: '2026-01-04T13:15:00Z' },
  ],
  F002: [
    { id: 3, type: 'fungal', message: 'High humidity (76%) + leaf wetness - fungal disease risk elevated', severity: 'high', timestamp: '2026-01-04T15:45:00Z' },
  ],
  F003: [
    { id: 4, type: 'pH', message: 'Soil pH too acidic (5.2) for wheat - consider lime application', severity: 'medium', timestamp: '2026-01-04T12:00:00Z' },
    { id: 5, type: 'vegetation', message: 'Vegetation health dropped (NDVI 0.45) - investigate nutrient deficiency', severity: 'high', timestamp: '2026-01-04T16:20:00Z' },
  ],
};

export default function Alerts({ fieldId, className = '' }) {
  const [alerts, setAlerts] = useState([]);
  const isAuth = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    if (!fieldId) {
      setAlerts([]);
      return;
    }
    
    // Mock fetch alerts
    const fieldAlerts = MOCK_ALERTS[fieldId] || [];
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setAlerts(prev => {
        // Add random new alert occasionally
        if (Math.random() > 0.9) {
          const newAlert = {
            id: Date.now(),
            type: ['irrigation', 'temperature', 'pH', 'vegetation', 'fungal', 'pest'][Math.floor(Math.random()*6)],
            message: 'New condition-based alert triggered',
            severity: ['low', 'medium', 'high'][Math.floor(Math.random()*3)],
            timestamp: new Date().toISOString(),
          };
          return [newAlert, ...prev.slice(0, 4)]; // Keep top 5
        }
        return prev;
      });
    }, 15000);

    setAlerts(fieldAlerts);
    return () => clearInterval(interval);
  }, [fieldId]);

  if (!isAuth || alerts.length === 0) return null;

  const getIcon = (type) => {
    const icons = {
      irrigation: Droplets,
      temperature: ThermometerSun,
      pH: 'pH',
      vegetation: Leaf,
      fungal: AlertTriangle,
      pest: Bug,
    };
    const Icon = icons[type] || AlertTriangle;
    return <Icon className="w-5 h-5" />;
  };

  const getSeverityClass = (severity) => {
    return {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200',
    }[severity] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-4">
        <Bell className="w-6 h-6 text-orange-500 shrink-0 animate-ring" />
        <div>
          <h3 className="font-bold text-lg text-gray-900">Field Alerts</h3>
          <p className="text-sm text-gray-600">{alerts.length} active {alerts.length === 1 ? 'alert' : 'alerts'}</p>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {alerts.map((alert) => (
          <div key={alert.id} className={`border rounded-2xl p-4 shadow-sm ${getSeverityClass(alert.severity)} hover:shadow-md transition-all`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl bg-white/50 shadow-sm flex-shrink-0 ${alert.severity === 'high' ? 'animate-pulse' : ''}`}>
                {getIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-sm leading-tight">{alert.message}</h4>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                    alert.severity === 'high' ? 'bg-red-200 text-red-900' :
                    alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-900' : 'bg-green-200 text-green-900'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className={`text-xs ${alert.type === 'pH' ? 'font-mono' : ''}`}>
                  {alert.type.toUpperCase()} • {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

