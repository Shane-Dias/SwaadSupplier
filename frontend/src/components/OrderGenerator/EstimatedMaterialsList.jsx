// src/components/OrderGenerator/EstimatedMaterialsList.jsx
import React from 'react';

export default function EstimatedMaterialsList({ ingredients, dish, quantity }) {
  if (!ingredients || Object.keys(ingredients).length === 0) {
    return (
      <div className="uniform-tab-content">
        <div className="tab-header-section">
          <h3>📦 Raw Materials</h3>
          <p>No ingredients data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="uniform-tab-content">
      <div className="tab-header-section">
        <h3>📦 Raw Materials Required</h3>
        <p>AI-calculated ingredients for your order</p>
      </div>

      <div className="tab-main-content">
        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-header">
            <span className="summary-icon">🍽️</span>
            <div className="summary-details">
              <div className="summary-dish">{dish.charAt(0).toUpperCase() + dish.slice(1)}</div>
              <div className="summary-quantity">{quantity} plates</div>
            </div>
          </div>
          <div className="summary-description">
            Based on our AI analysis, here are the exact ingredients and quantities needed for your order
          </div>
        </div>

        {/* Materials Grid */}
        <div className="materials-grid">
          {Object.entries(ingredients).map(([ingredient, details]) => (
            <div key={ingredient} className="material-card">
              <div className="material-header">
                <div className="material-name">
                  <span className="material-icon">🥘</span>
                  {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                </div>
                <div className="material-badge">Required</div>
              </div>
              
              <div className="material-details">
                <div className="quantity-section">
                  <div className="quantity-label">Total Quantity</div>
                  <div className="quantity-value">
                    {details.totalQuantity} {details.unit}
                  </div>
                </div>
                
                <div className="per-plate-section">
                  <div className="per-plate-label">Per Plate</div>
                  <div className="per-plate-value">
                    {details.quantityPerPlate} {details.unit}
                  </div>
                </div>
              </div>

              <div className="material-calculation">
                <div className="calculation-formula">
                  <span className="formula-text">
                    {details.quantityPerPlate} {details.unit} × {quantity} plates = {details.totalQuantity} {details.unit}
                  </span>
                </div>
              </div>

              <div className="material-status">
                <div className="status-indicator">
                  <span className="status-dot"></span>
                  <span className="status-text">Ready for supplier selection</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Stats */}
        <div className="order-stats">
          <div className="stats-header">
            <h4>📊 Order Statistics</h4>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🥘</div>
              <div className="stat-content">
                <div className="stat-value">{Object.keys(ingredients).length}</div>
                <div className="stat-label">Unique Ingredients</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📏</div>
              <div className="stat-content">
                <div className="stat-value">{quantity}</div>
                <div className="stat-label">Total Plates</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚖️</div>
              <div className="stat-content">
                <div className="stat-value">
                  {Object.values(ingredients).reduce((total, ingredient) => {
                    return total + (ingredient.unit === 'g' ? ingredient.totalQuantity : 0);
                  }, 0).toLocaleString()}g
                </div>
                <div className="stat-label">Total Weight</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🥤</div>
              <div className="stat-content">
                <div className="stat-value">
                  {Object.values(ingredients).reduce((total, ingredient) => {
                    return total + (ingredient.unit === 'ml' ? ingredient.totalQuantity : 0);
                  }, 0).toLocaleString()}ml
                </div>
                <div className="stat-label">Total Volume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preparation Tips */}
        <div className="preparation-tips">
          <div className="tips-header">
            <h4>💡 Preparation Tips</h4>
          </div>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">⏰</div>
              <div className="tip-content">
                <div className="tip-title">Order in Advance</div>
                <div className="tip-description">Place orders 24-48 hours before needed to ensure availability</div>
              </div>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🌡️</div>
              <div className="tip-content">
                <div className="tip-title">Storage Requirements</div>
                <div className="tip-description">Check storage conditions for perishable ingredients</div>
              </div>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📝</div>
              <div className="tip-content">
                <div className="tip-title">Quality Check</div>
                <div className="tip-description">Verify ingredient quality upon delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
