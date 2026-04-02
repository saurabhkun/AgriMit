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
import { TrendingUp, TrendingDown, Leaf } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MOCK_VEG_DATA = {
  labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
  datasets: [
    {
      label: 'NDVI (Vegetation Health)',
      data: [0.72, 0.68, 0.65, 0.62, 0.58, 0.55, 0.52],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#16A34A',
      pointBorderColor: '#059669',
      pointHoverRadius: 8,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const ndvi = context.parsed.y;
          const health = ndvi > 0.7 ? 'Excellent' : ndvi > 0.6 ? 'Good' : ndvi > 0.5 ? 'Fair' : 'Poor';
          return `NDVI: ${ndvi.toFixed(2)} (${health})`;
        }
      }
    }
  },
  scales: {
    y: {
      min: 0,
      max: 1,
      ticks: {
        callback: function(value) {
          const labels = { 0: 'Poor', 0.3: 'Fair', 0.6: 'Good', 1: 'Excellent' };
          return labels[value] || value;
        }
      },
      grid: {
        color: 'rgba(0,0,0,0.05)',
      }
    },
    x: {
      grid: {
        display: false,
      }
    }
  },
  animation: {
    duration: 1500,
  },
};

export default function VegetationHealthGraph({ fieldId, height = '300px' }) {
  return (
    <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/50 rounded-xl shadow-sm backdrop-blur-sm">
          <Leaf className="w-6 h-6 text-agri-leaf" />
        </div>
        <div>
          <h3 className="font-bold text-xl text-gray-900 tracking-tight">Vegetation Health (NDVI)</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            {fieldId || 'F001'} • <TrendingDown className="w-4 h-4 text-orange-500" /> Recent decline detected
          </p>
        </div>
      </div>

      <div style={{ height }} className="w-full">
        <Line data={MOCK_VEG_DATA} options={chartOptions} />
      </div>

      {/* Health summary */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-green-100">
        <div className="text-center p-3 bg-white rounded-xl shadow-sm">
          <div className="text-2xl font-bold text-gray-900">0.52</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Current NDVI</div>
        </div>
        <div className="text-center p-3 bg-white rounded-xl shadow-sm">
          <div className="text-2xl font-bold text-orange-600">-0.20</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">7-Day Change</div>
        </div>
      </div>
    </div>
  );
}

