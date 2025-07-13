import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StockLevelsChart = ({ items = [] }) => {
  // Debug logging
  console.log('StockLevelsChart received items:', items);
  
  if (!items || items.length === 0) {
    return (
      <div className="chart-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <p>No items available for stock chart</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: items.map(item => item.name),
    datasets: [
      {
        label: 'Stock Quantity',
        data: items.map(item => item.quantity),
        backgroundColor: items.map(item => 
          item.quantity < 10 ? 'rgba(255, 99, 132, 0.8)' : // Red for low stock
          item.quantity < 25 ? 'rgba(255, 206, 86, 0.8)' : // Yellow for medium stock
          'rgba(75, 192, 192, 0.8)' // Green for good stock
        ),
        borderColor: items.map(item => 
          item.quantity < 10 ? 'rgba(255, 99, 132, 1)' :
          item.quantity < 25 ? 'rgba(255, 206, 86, 1)' :
          'rgba(75, 192, 192, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Current Stock Levels',
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const quantity = context.parsed.y;
            if (quantity < 10) {
              return 'Status: Low Stock';
            } else if (quantity < 25) {
              return 'Status: Medium Stock';
            } else {
              return 'Status: Good Stock';
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Items'
        }
      }
    },
    animation: {
      duration: 500,
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default StockLevelsChart;