import React, { useState, useEffect } from 'react';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LiveInventoryChart = ({ dashboardData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Total Inventory Value',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  });

  const maxDataPoints = 20; // Keep last 20 data points

  useEffect(() => {
    if (dashboardData && dashboardData.totalValue !== undefined) {
      const currentTime = new Date().toLocaleTimeString();
      
      setChartData(prevData => {
        const newLabels = [...prevData.labels, currentTime];
        const newData = [...prevData.datasets[0].data, dashboardData.totalValue];
        
        // Keep only the last maxDataPoints
        if (newLabels.length > maxDataPoints) {
          newLabels.shift();
          newData.shift();
        }
        
        return {
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newData,
            },
          ],
        };
      });
    }
  }, [dashboardData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Real-Time Inventory Value',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      },
    },
    animation: {
      duration: 300,
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LiveInventoryChart;