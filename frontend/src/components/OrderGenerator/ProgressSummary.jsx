// src/components/OrderGenerator/ProgressSummary.jsx
import React from 'react';

export default function ProgressSummary({ orderData, selectedSuppliers, totalCost }) {
  if (!orderData) return null;

  const suppliersSelected = Object.keys(selectedSuppliers).length;
  const totalIngredients = Object.keys(orderData.ingredients).length;
  const completionPercentage = Math.round((suppliersSelected / totalIngredients) * 100);

  return (
    <div className="progress-summary-compact">
      <div className="progress-header">
        <h4>Current Order</h4>
        <div className="progress-percentage">{completionPercentage}%</div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      
      <div className="order-info">
        <div className="info-item">
          <span className="info-icon">🍽️</span>
          <div>
            <div className="info-value">{orderData.dish}</div>
            <div className="info-label">{orderData.quantity} plates</div>
          </div>
        </div>
        
        <div className="info-item">
          <span className="info-icon">📦</span>
          <div>
            <div className="info-value">{totalIngredients}</div>
            <div className="info-label">ingredients</div>
          </div>
        </div>
        
        <div className="info-item">
          <span className="info-icon">🏪</span>
          <div>
            <div className="info-value">{suppliersSelected}/{totalIngredients}</div>
            <div className="info-label">suppliers</div>
          </div>
        </div>
        
        {totalCost > 0 && (
          <div className="info-item total-cost">
            <span className="info-icon">💰</span>
            <div>
              <div className="info-value">₹{totalCost.toLocaleString()}</div>
              <div className="info-label">estimated</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
