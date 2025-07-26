// src/components/OrderGenerator/ProgressSummary.jsx
import React from 'react';

export default function ProgressSummary({ orderData, selectedSuppliers, totalCost }) {
  if (!orderData) return null;

  const suppliersSelected = Object.keys(selectedSuppliers).length;
  const totalIngredients = Object.keys(orderData.ingredients).length;
  const completionPercentage = Math.round((suppliersSelected / totalIngredients) * 100);

  return (
    <div className="progress-summary glass-morphism">
      <div className="progress-header">
        <h4>Order Progress</h4>
        <div className="progress-badge">{completionPercentage}%</div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      <div className="metrics-grid">
        <div className="metric-item">
          <span className="metric-icon">🍽️</span>
          <div className="metric-content">
            <div className="metric-value">{orderData.dish}</div>
            <div className="metric-label">{orderData.quantity} plates</div>
          </div>
        </div>
        
        <div className="metric-item">
          <span className="metric-icon">📦</span>
          <div className="metric-content">
            <div className="metric-value">{totalIngredients}</div>
            <div className="metric-label">ingredients</div>
          </div>
        </div>
        
        <div className="metric-item">
          <span className="metric-icon">🏪</span>
          <div className="metric-content">
            <div className="metric-value">{suppliersSelected}/{totalIngredients}</div>
            <div className="metric-label">suppliers selected</div>
          </div>
        </div>
        
        {totalCost > 0 && (
          <div className="metric-item total-cost">
            <span className="metric-icon">💰</span>
            <div className="metric-content">
              <div className="metric-value">₹{totalCost.toLocaleString()}</div>
              <div className="metric-label">estimated total</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
