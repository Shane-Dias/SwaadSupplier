// src/components/OrderGenerator/EstimatedMaterialsList.jsx
import React from 'react';

export default function EstimatedMaterialsList({ ingredients, dish, quantity }) {
  if (!ingredients || Object.keys(ingredients).length === 0) {
    return null;
  }

  return (
    <div className="estimated-materials">
      <h3>📋 Estimated Raw Materials</h3>
      <p className="order-summary">
        For <strong>{quantity} plates of {dish}</strong>
      </p>
      
      <div className="materials-list">
        {Object.entries(ingredients).map(([ingredient, details]) => (
          <div key={ingredient} className="material-item">
            <div className="material-info">
              <span className="ingredient-name">{ingredient.toUpperCase()}</span>
              <span className="quantity">
                {details.totalQuantity} {details.unit}
              </span>
            </div>
            <div className="per-unit">
              ({details.perUnit} {details.unit} per plate)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
