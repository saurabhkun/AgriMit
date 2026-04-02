import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Droplets, ThermometerSun, TestTube, Activity, Wifi } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MOCK_SENSOR_DATA = {
  labels: ['10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM'],
  ph: [6.8, 6.7, 6.5, 6.4, 6.2, 6.1, 6.0],
  temperature: [28, 29, 31, 33, 34, 32, 30],
  moisture: [45, 42, 40, 38, 36, 34, 32],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    y: {
      grid: { color: 'rgba(0,0,0,0.04)' },
      ticks: { color: 'gray' },
    },
    x: {
      grid: { display: false },
    },
  },
};

export default function SensorGraphs({ fieldId, height = '350px' }) {
  const [data, setData] = useState(MOCK_SENSOR_DATA);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setData(prev => {
        const newPh = (prev.ph[prev.ph.length - 1] + (Math.random() - 0.5) * 0.2).toFixed(1);
        const newTemp = (prev.temperature[prev.temperature.length - 1] + (Math.random() - 0.5) * 1).toFixed(0);
        const newMoisture = (prev.moisture[prev.moisture.length - 1] + (Math.random() - 0.5) * 2).toFixed(0);
        
        return {
          labels: [...prev.labels.slice(1), new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})],
          ph: [...prev.ph.slice(1), +newPh],
          temperature: [...prev.temperature.slice(1), +newTemp],
          moisture: [...prev.moisture.slice(1), +newMoisture],
        };
      });
    }, 5000); // Update every 5s

    return () => clearInterval(interval);
  }, [isLive]);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Soil pH',
        data: data.ph,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
      {
        label: 'Temperature (°C)',
        data: data.temperature,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Soil Moisture (%)',
        data: data.moisture,
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
        yAxisID: 'y2',
      },
    ],
  };

  return (
    <div className="card bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/60 rounded-2xl shadow-lg backdrop-blur-sm border border-white/40">
            <TestTube className="w-7 h-7 text-indigo-500" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900">Soil Sensors - Live Data</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              {fieldId || 'F001'} •{' '}
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                isLive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
              }`}>
                {isLive ? <Activity className="w-3 h-3 inline animate-spin mr-1" /> : '●'} Live
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium px-3 py-1.5 bg-white/50 rounded-xl backdrop-blur-sm border border-indigo-200 hover:shadow-md transition-all"
        >
          {isLive ? 'Pause' : 'Resume'} Live
          <Wifi className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      <div style={{ height }} className="w-full mb-6">
        <Line 
          data={chartData} 
          options={{
            ...chartOptions,
            scales: {
              ...chartOptions.scales,
              y1: {
                type: 'linear',
                display: false,
                position: 'right',
                min: 5.5,
                max: 7.5,
              },
              y2: {
                type: 'linear',
                display: false,
                position: 'left',
                min: 0,
                max: 100,
                grid: { drawOnChartArea: false },
              },
              y: {
                ...chartOptions.scales.y,
                position: 'left',
                min: 20,
                max: 40,
              },
            },
          }} 
        />
      </div>

      {/* Current readings summary */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/70 p-4 rounded-xl backdrop-blur-sm shadow-sm">
          <div className="text-2xl font-bold text-indigo-600 mb-1">{data.ph[data.ph.length-1]}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">pH</div>
        </div>
        <div className="bg-white/70 p-4 rounded-xl backdrop-blur-sm shadow-sm">
          <div className="text-2xl font-bold text-orange-600 mb-1">{data.temperature[data.temperature.length-1]}°C</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Temperature</div>
        </div>
        <div className="bg-white/70 p-4 rounded-xl backdrop-blur-sm shadow-sm">
          <div className="text-2xl font-bold text-emerald-600 mb-1">{data.moisture[data.moisture.length-1]}%</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Moisture</div>
        </div>
      </div>
    </div>
  );
}

