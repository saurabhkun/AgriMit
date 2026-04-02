import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend
);

export default function VegetationHealthGraph({ fieldId, analyses = [] }) {
  const labels = analyses.map(a => new Date(a.timestamp).toLocaleDateString()).slice(0,7);

  // Mock NDVI/disease data
  const ndviData = [0.65, 0.68, 0.62, 0.59, 0.71, 0.67, 0.64];
  const diseaseSeverity = [10, 15, 25, 35, 20, 28, 22];

  const lineData = {
    labels,
    datasets: [{
      label: 'NDVI (Vegetation Health)',
      data: ndviData,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      tension: 0.4,
      fill: true,
    }]
  };

  const barData = {
    labels,
    datasets: [{
      label: 'Disease Severity %',
      data: diseaseSeverity,
      backgroundColor: 'rgb(239, 68, 68)',
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: `Vegetation Health - Field ${fieldId}` }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
      <div className="card">
        <Line data={lineData} options={options} />
      </div>
      <div className="card">
        <Bar data={barData} options={options} />
      </div>
    </div>
  );
}

