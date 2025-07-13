import React from 'react';
import LiveInventoryChart from './LiveInventoryChart';
import StockLevelsChart from './StockLevelsChart';

const Dashboard = ({ dashboardData, items = [] }) => {
  // Debug logging
  console.log('Dashboard received data:', dashboardData);
  console.log('Dashboard received items:', items);
  
  if (!dashboardData) {
    return <div className="dashboard">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Real-Time Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Items</h3>
          <p className="stat-value">{dashboardData.totalItems}</p>
        </div>
        <div className="stat-card">
          <h3>Total Value</h3>
          <p className="stat-value">${dashboardData.totalValue?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <p className="stat-value">{dashboardData.lowStockItems}</p>
        </div>
      </div>
      
      <div className="charts-section">
        <div className="chart-row">
          <div className="chart-wrapper">
            <LiveInventoryChart dashboardData={dashboardData} />
          </div>
          <div className="chart-wrapper">
            <StockLevelsChart items={items} />
          </div>
        </div>
      </div>
      
      <div className="recent-items">
        <h3>Recent Items</h3>
        {dashboardData.recentItems && dashboardData.recentItems.length > 0 ? (
          <ul>
            {dashboardData.recentItems.map(item => (
              <li key={item.id}>
                {item.name} - ${item.price} (Qty: {item.quantity})
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent items</p>
        )}
      </div>
      
      <div className="last-updated">
        Last Updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default Dashboard;