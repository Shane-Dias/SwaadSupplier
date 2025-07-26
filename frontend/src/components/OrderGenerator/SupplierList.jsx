// src/components/OrderGenerator/SupplierList.jsx
import React, { useState, useEffect } from 'react';
import { getSuppliersByIngredient } from '../../utils/supplierData';

export default function SupplierList({ ingredients, onSupplierSelect }) {
  const [selectedSuppliers, setSelectedSuppliers] = useState({});
  const [suppliersData, setSuppliersData] = useState({});

  useEffect(() => {
    if (!ingredients) return;

    const newSuppliersData = {};
    const newSelectedSuppliers = {};

    Object.keys(ingredients).forEach(ingredient => {
      const suppliers = getSuppliersByIngredient(ingredient);
      newSuppliersData[ingredient] = suppliers;
      
      // Auto-select best supplier (lowest price)
      if (suppliers.length > 0) {
        const bestSupplier = suppliers.sort((a, b) => a.price - b.price)[0];
        newSelectedSuppliers[ingredient] = bestSupplier.id;
      }
    });

    setSuppliersData(newSuppliersData);
    setSelectedSuppliers(newSelectedSuppliers);
    onSupplierSelect(newSelectedSuppliers, newSuppliersData);
  }, [ingredients, onSupplierSelect]);

  const handleSupplierChange = (ingredient, supplierId) => {
    const newSelected = {
      ...selectedSuppliers,
      [ingredient]: parseInt(supplierId)
    };
    setSelectedSuppliers(newSelected);
    onSupplierSelect(newSelected, suppliersData);
  };

  if (!ingredients || Object.keys(ingredients).length === 0) {
    return null;
  }

  return (
    <div className="uniform-tab-content">
      <div className="tab-header-section">
        <h3>
          <span className="header-icon">🏪</span>
          Select Suppliers
        </h3>
        <p>Choose the best suppliers for each ingredient</p>
      </div>

      <div className="suppliers-container">
        {Object.entries(ingredients).map(([ingredient, details]) => {
          const suppliers = suppliersData[ingredient] || [];
          
          return (
            <div key={ingredient} className="supplier-section glass-morphism">
              <div className="ingredient-header">
                <h4>{ingredient.toUpperCase()}</h4>
                <span className="quantity-badge">
                  {details.totalQuantity} {details.unit}
                </span>
              </div>
              
              {suppliers.length === 0 ? (
                <div className="no-suppliers glass-morphism">
                  <span className="warning-icon">⚠️</span>
                  No suppliers available for this ingredient
                </div>
              ) : (
                <div className="supplier-grid">
                  {suppliers.map(supplier => (
                    <label 
                      key={supplier.id} 
                      className={`supplier-card glass-morphism ${
                        selectedSuppliers[ingredient] === supplier.id ? 'selected' : ''
                      }`}
                    >
                      <input 
                        type="radio"
                        name={`supplier-${ingredient}`}
                        value={supplier.id}
                        checked={selectedSuppliers[ingredient] === supplier.id}
                        onChange={(e) => handleSupplierChange(ingredient, e.target.value)}
                      />
                      
                      <div className="supplier-content">
                        <div className="supplier-header">
                          <span className="supplier-name">{supplier.name}</span>
                          <span className="supplier-rating">
                            ⭐ {supplier.rating}
                          </span>
                        </div>
                        
                        <div className="supplier-metrics">
                          <span className="price-badge">
                            ₹{supplier.price}/{supplier.unit}
                          </span>
                          <span className="distance-badge">
                            📍 {supplier.distance}
                          </span>
                          <span className="stock-badge">
                            📦 {supplier.stock} {supplier.unit}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
