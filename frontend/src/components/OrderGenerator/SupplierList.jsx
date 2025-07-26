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
    <div className="supplier-list">
      <h3>🏪 Available Suppliers</h3>
      
      {Object.entries(ingredients).map(([ingredient, details]) => {
        const suppliers = suppliersData[ingredient] || [];
        
        return (
          <div key={ingredient} className="supplier-section">
            <h4>{ingredient.toUpperCase()} ({details.totalQuantity} {details.unit})</h4>
            
            {suppliers.length === 0 ? (
              <p className="no-suppliers">No suppliers available for this ingredient</p>
            ) : (
              <div className="supplier-options">
                {suppliers.map(supplier => (
                  <div key={supplier.id} className="supplier-card">
                    <label className="supplier-option">
                      <input 
                        type="radio"
                        name={`supplier-${ingredient}`}
                        value={supplier.id}
                        checked={selectedSuppliers[ingredient] === supplier.id}
                        onChange={(e) => handleSupplierChange(ingredient, e.target.value)}
                      />
                      <div className="supplier-details">
                        <div className="supplier-name">{supplier.name}</div>
                        <div className="supplier-info">
                          <span className="price">₹{supplier.price}/{supplier.unit}</span>
                          <span className="distance">{supplier.distance}</span>
                          <span className="rating">⭐ {supplier.rating}</span>
                          <span className="stock">Stock: {supplier.stock} {supplier.unit}</span>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
