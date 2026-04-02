import { useState, useEffect } from "react";
import { api } from "../api";
import StatusBadge from "./StatusBadge";
import RiskChip from "./RiskChip";
import FarmMap from "./FarmMap";
import SensorGraphs from "./SensorGraphs";
import VegetationHealthGraph from "./VegetationHealthGraph";
import ImageAnalysisCard from "./ImageAnalysisCard";
import AdvicePanel from "./AdvicePanel";
import SimpleChatBot from "./SimpleChatBot";
import { AlertTriangle, TrendingUp, BarChart3, Activity, Shield } from 'lucide-react';

export default function ExpertView() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

  // Mock comprehensive data for expert dashboard
  const mockFields = [
    {
      id: 'F001',
      name: 'Alpha Farm',
      cropType: 'Corn',
      acres: 120,
      location: 'Iowa 41.5°N 93.5°W',
      ndvi: 0.78,
      irrigationScore: 0.85,
      diseaseRisk: 'low',
      overallRisk: 'low',
      sensorData: { temp: 28, humidity: 65, moisture: 42 },
      recentAdvice: 'Optimal conditions. Maintain schedule.'
    },
    {
      id: 'F002',
      name: 'Beta Field',
      cropType: 'Wheat',
      acres: 85,
      location: 'Kansas 38.8°N 97.4°W',
      ndvi: 0.65,
      irrigationScore: 0.92,
      diseaseRisk: 'medium',
      overallRisk: 'medium',
      sensorData: { temp: 24, humidity: 55, moisture: 60 },
      recentAdvice: 'Watch rust development.'
    },
    {
      id: 'F003',
      name: 'Gamma Plot',
      cropType: 'Soybean',
      acres: 95,
      location: 'Illinois 40.0°N 89.0°W',
      ndvi: 0.45,
      irrigationScore: 0.35,
      diseaseRisk: 'high',
      overallRisk: 'high',
      sensorData: { temp: 34, humidity: 40, moisture: 18 },
      recentAdvice: 'URGENT: Irrigate + fungicide NOW.'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFields(mockFields);
      setSelectedField(mockFields[0]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-agri-leaf mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading Expert Dashboard...</p>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk) => ({
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  })[risk] || 'bg-gray-100 text-gray-800';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-8">
      <SimpleChatBot fieldName={selectedField?.name} />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expert Dashboard</h1>
            <p className="text-gray-600 mt-1">Multi-field analytics & recommendations</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Live Data</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">3 Fields</span>
          </div>
        </div>

        {/* Risk Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">High Risk Fields</h3>
                <p className="text-gray-600">Immediate attention</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">{fields.filter(f => f.overallRisk === 'high').length}</div>
            <div className="text-sm text-gray-500">{fields.filter(f => f.overallRisk === 'high').map(f => f.name).join(', ')}</div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">Avg NDVI</h3>
                <p className="text-gray-600">All fields</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{fields.reduce((sum, f) => sum + f.ndvi, 0) / fields.length?.toFixed(2)}</div>
            <div className="flex gap-1 text-sm text-gray-500">
              {fields.map(f => (
                <StatusBadge key={f.id} status={f.ndvi > 0.7 ? 'good' : f.ndvi > 0.5 ? 'warning' : 'danger'} size="xs" />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">Irrigation Score</h3>
                <p className="text-gray-600">Avg across farms</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-2">{fields.reduce((sum, f) => sum + f.irrigationScore, 0) / fields.length?.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Overall good moisture levels</div>
          </div>
        </div>

        {/* Field Comparison Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">Field Comparison</h2>
            </div>
            <p className="text-gray-600">Multi-field analytics dashboard</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Field</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">NDVI</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Irrigation</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Risk</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fields.map((field, i) => (
                  <tr key={field.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{field.name}</td>
                    <td className="px-6 py-4 text-right font-mono text-lg text-emerald-600">{field.ndvi}</td>
                    <td className="px-6 py-4 text-right font-mono text-lg text-blue-600">{field.irrigationScore}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskColor(field.overallRisk)}`}>
                        {field.overallRisk.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={field.overallRisk} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="btn-primary text-xs px-3 py-1.5" onClick={() => setSelectedField(field)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Field Detail */}
        {selectedField && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <StatusBadge status={selectedField.overallRisk} size="xl" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedField.name}</h2>
                <p className="text-gray-600">{selectedField.cropType} | {selectedField.location} | {selectedField.acres} acres</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sensor Dashboard */}
              <div className="space-y-6">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-600" />
                  Sensor Analytics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RiskChip label="Irrigation" level={selectedField.irrigationScore > 0.7 ? 'low' : 'high'} value={`${(selectedField.irrigationScore*100).toFixed(0)}%`} />
                  <RiskChip label="Temperature" level="low" value={`${selectedField.sensorData.temp}°C`} />
                  <RiskChip label="Humidity" level="low" value={`${selectedField.sensorData.humidity}%`} />
                  <RiskChip label="Overall" level={selectedField.overallRisk} value="Dashboard" />
                </div>
                <SensorGraphs sensorData={selectedField.sensorData} />
              </div>

              {/* NDVI & Advice */}
              <div className="space-y-6">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                  NDVI & Recommendations
                </h3>
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-8 rounded-2xl border border-emerald-200">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-black text-emerald-600 mb-2">{selectedField.ndvi}</div>
                    <p className="text-lg text-gray-600">NDVI Score</p>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full" style={{width: `${(selectedField.ndvi * 100)}%`}}></div>
                    </div>
                  </div>
                  <AdvicePanel advice={selectedField.recentAdvice} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expert Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
          <div className="bg-white p-8 rounded-2xl shadow-xl border hover:shadow-2xl transition-all group">
            <Shield className="w-12 h-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2">Risk Alerts</h3>
            <p className="text-gray-600 mb-4">1 High, 1 Medium risk field</p>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-all">View Alerts</button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border hover:shadow-2xl transition-all group">
            <BarChart3 className="w-12 h-12 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2">Portfolio Analytics</h3>
            <p className="text-gray-600 mb-4">NDVI avg 0.68 across 3 fields</p>
            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all">Generate Report</button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border hover:shadow-2xl transition-all group">
            <TrendingUp className="w-12 h-12 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2">Trend Analysis</h3>
            <p className="text-gray-600 mb-4">+12% yield potential improvement</p>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold transition-all">View Trends</button>
          </div>
        </div>
      </div>
    </div>
  );
}

