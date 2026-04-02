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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SensorGraphs({ sensorData, fieldId }) {
  if (!sensorData) return null;

  const labels = sensorData.timestamps || ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'Today'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Soil Moisture %',
        data: sensorData.soilMoisture || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'pH',
        data: sensorData.ph || [6.8, 6.9, 7.0, 6.7, 6.5, 6.4, 6.3],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
      {
        label: 'Temp °C',
        data: sensorData.airTemp || [],
        borderColor: 'rgb(248, 113, 113)',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Humidity %',
        data: sensorData.humidity || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: `Sensor Data - Field ${fieldId}`,
        font: { size: 16, weight: 'bold' }
      },
      legend: { position: 'top' },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Moisture/Temp/Humidity (%) / °C' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'pH' },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return <div className="card h-80"><Line data={data} options={options} /></div>;
}

