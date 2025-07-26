// src/components/OrderGenerator/OrderCart.jsx
import React, { useState, useEffect } from 'react';

export default function OrderCart({ 
  ingredients, 
  selectedSuppliers, 
  suppliersData, 
  dish, 
  quantity 
}) {
  const [orderQuantities, setOrderQuantities] = useState({});
  const [totalCost, setTotalCost] = useState(0);

  // Initialize order quantities based on required amounts
  useEffect(() => {
    const initialQuantities = {};
    Object.entries(ingredients).forEach(([ingredient, details]) => {
      const supplierId = selectedSuppliers[ingredient];
      if (supplierId) {
        // Convert to kg/liters for ordering
        const requiredKg = details.totalQuantity / 1000;
        const requiredLiters = details.unit === 'ml' ? details.totalQuantity / 1000 : 0;
        const requiredQuantity = details.unit === 'ml' ? requiredLiters : requiredKg;
        initialQuantities[ingredient] = Math.ceil(requiredQuantity);
      }
    });
    setOrderQuantities(initialQuantities);
  }, [ingredients, selectedSuppliers]);

  // Calculate total cost whenever quantities change
  useEffect(() => {
    let total = 0;
    Object.entries(orderQuantities).forEach(([ingredient, orderQuantity]) => {
      const supplierId = selectedSuppliers[ingredient];
      const suppliers = suppliersData[ingredient] || [];
      const supplier = suppliers.find(s => s.id === supplierId);
      
      if (supplier && orderQuantity) {
        total += orderQuantity * supplier.price;
      }
    });
    setTotalCost(total);
  }, [orderQuantities, selectedSuppliers, suppliersData]);

  const handleQuantityChange = (ingredient, newQuantity) => {
    setOrderQuantities(prev => ({
      ...prev,
      [ingredient]: Math.max(0, parseInt(newQuantity) || 0)
    }));
  };

  const handlePlaceOrder = () => {
    const orderDetails = {
      dish,
      quantity,
      ingredients: Object.entries(orderQuantities).map(([ingredient, orderQuantity]) => {
        const supplierId = selectedSuppliers[ingredient];
        const suppliers = suppliersData[ingredient] || [];
        const supplier = suppliers.find(s => s.id === supplierId);
        const details = ingredients[ingredient];
        
        return {
          ingredient,
          supplier: supplier?.name || 'Unknown',
          supplierId,
          orderQuantity,
          pricePerUnit: supplier?.price || 0,
          totalPrice: orderQuantity * (supplier?.price || 0),
          requiredQuantity: details.totalQuantity,
          unit: details.unit
        };
      }),
      totalCost,
      orderDate: new Date().toISOString()
    };

    console.log('Order placed:', orderDetails);
    alert(`Order placed successfully! Total cost: ₹${totalCost.toLocaleString()}`);
  };

  if (!ingredients || Object.keys(selectedSuppliers).length === 0) {
    return (
      <div className="uniform-tab-content">
        <div className="tab-header-section">
          <h3>🛒 Review & Order</h3>
          <p>No suppliers selected yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="uniform-tab-content">
      <div className="tab-header-section">
        <h3>🛒 Review & Order</h3>
        <p>Review your cart and confirm your order</p>
      </div>

      <div className="tab-main-content">
        {/* Order Summary Header */}
        <div className="cart-summary-header">
          <div className="summary-main">
            <div className="summary-dish-info">
              <span className="dish-icon">🍽️</span>
              <div className="dish-details">
                <div className="dish-name">{dish.charAt(0).toUpperCase() + dish.slice(1)}</div>
                <div className="dish-quantity">{quantity} plates</div>
              </div>
            </div>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-value">{Object.keys(ingredients).length}</span>
                <span className="stat-label">ingredients</span>
              </div>
              <div className="stat">
                <span className="stat-value">{Object.keys(selectedSuppliers).length}</span>
                <span className="stat-label">suppliers</span>
              </div>
              <div className="stat highlight">
                <span className="stat-value">₹{totalCost.toLocaleString()}</span>
                <span className="stat-label">total cost</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="cart-items-section">
          <div className="section-header">
            <h4>📋 Order Items</h4>
            <div className="items-count">{Object.keys(selectedSuppliers).length} items</div>
          </div>

          <div className="cart-items-grid">
            {Object.entries(selectedSuppliers).map(([ingredient, supplierId]) => {
              const suppliers = suppliersData[ingredient] || [];
              const supplier = suppliers.find(s => s.id === supplierId);
              const details = ingredients[ingredient];
              const orderQuantity = orderQuantities[ingredient] || 0;
              const itemTotal = orderQuantity * (supplier?.price || 0);
              
              // Required quantity calculation
              const requiredKg = details.totalQuantity / 1000;
              const requiredLiters = details.unit === 'ml' ? details.totalQuantity / 1000 : 0;
              const requiredQuantity = details.unit === 'ml' ? requiredLiters : requiredKg;
              const unit = details.unit === 'ml' ? 'L' : 'kg';

              return (
                <div key={ingredient} className="cart-item-card">
                  <div className="item-header">
                    <div className="item-info">
                      <div className="ingredient-name">
                        <span className="ingredient-icon">🥘</span>
                        {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                      </div>
                      <div className="supplier-info">
                        <span className="supplier-label">Supplier:</span>
                        <span className="supplier-name">{supplier?.name || 'Unknown'}</span>
                        <span className="supplier-rating">⭐ {supplier?.rating || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="item-total">₹{itemTotal.toLocaleString()}</div>
                  </div>

                  <div className="item-details">
                    <div className="quantity-section">
                      <div className="quantity-info">
                        <div className="required-qty">
                          <span className="qty-label">Required:</span>
                          <span className="qty-value">{requiredQuantity.toFixed(2)} {unit}</span>
                        </div>
                        <div className="order-qty">
                          <span className="qty-label">Ordering:</span>
                          <div className="quantity-input-group">
                            <button
                              className="qty-btn minus"
                              onClick={() => handleQuantityChange(ingredient, orderQuantity - 1)}
                              disabled={orderQuantity <= 1}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={orderQuantity}
                              onChange={(e) => handleQuantityChange(ingredient, e.target.value)}
                              className="qty-input"
                              min="0"
                            />
                            <button
                              className="qty-btn plus"
                              onClick={() => handleQuantityChange(ingredient, orderQuantity + 1)}
                            >
                              +
                            </button>
                            <span className="qty-unit">{unit}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pricing-info">
                        <div className="price-per-unit">
                          ₹{supplier?.price || 0}/{unit}
                        </div>
                        <div className="availability">
                          <span className="availability-dot"></span>
                          {supplier?.availability || 'In Stock'}
                        </div>
                      </div>
                    </div>

                    {orderQuantity < requiredQuantity && (
                      <div className="warning-message">
                        <span className="warning-icon">⚠️</span>
                        <span className="warning-text">
                          Ordering less than required quantity. You may need additional {ingredient}.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-section">
          <div className="summary-header">
            <h4>💰 Order Summary</h4>
          </div>
          
          <div className="summary-breakdown">
            <div className="breakdown-items">
              {Object.entries(selectedSuppliers).map(([ingredient, supplierId]) => {
                const suppliers = suppliersData[ingredient] || [];
                const supplier = suppliers.find(s => s.id === supplierId);
                const orderQuantity = orderQuantities[ingredient] || 0;
                const itemTotal = orderQuantity * (supplier?.price || 0);
                const unit = ingredients[ingredient].unit === 'ml' ? 'L' : 'kg';

                return (
                  <div key={ingredient} className="breakdown-item">
                    <div className="breakdown-ingredient">
                      {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                      <span className="breakdown-qty">({orderQuantity} {unit})</span>
                    </div>
                    <div className="breakdown-price">₹{itemTotal.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="summary-total">
              <div className="total-row">
                <span className="total-label">Subtotal:</span>
                <span className="total-value">₹{totalCost.toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span className="total-label">Delivery Fee:</span>
                <span className="total-value">₹50</span>
              </div>
              <div className="total-row">
                <span className="total-label">Tax (5%):</span>
                <span className="total-value">₹{Math.round(totalCost * 0.05).toLocaleString()}</span>
              </div>
              <div className="total-row final">
                <span className="total-label">Total Amount:</span>
                <span className="total-value">₹{Math.round(totalCost * 1.05 + 50).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="delivery-info-section">
          <div className="info-header">
            <h4>🚚 Delivery Information</h4>
          </div>
          <div className="delivery-details">
            <div className="delivery-item">
              <span className="delivery-icon">📅</span>
              <div className="delivery-content">
                <div className="delivery-label">Estimated Delivery</div>
                <div className="delivery-value">Tomorrow, 10:00 AM - 2:00 PM</div>
              </div>
            </div>
            <div className="delivery-item">
              <span className="delivery-icon">📍</span>
              <div className="delivery-content">
                <div className="delivery-label">Delivery Address</div>
                <div className="delivery-value">Restaurant Kitchen, Main Branch</div>
              </div>
            </div>
            <div className="delivery-item">
              <span className="delivery-icon">📞</span>
              <div className="delivery-content">
                <div className="delivery-label">Contact</div>
                <div className="delivery-value">+91 98765 43210</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="cart-actions">
          <button className="btn btn-secondary save-btn">
            <span>💾</span>
            Save as Template
          </button>
          <button 
            className="btn btn-success place-order-btn"
            onClick={handlePlaceOrder}
            disabled={totalCost === 0}
          >
            <span>🚀</span>
            Place Order - ₹{Math.round(totalCost * 1.05 + 50).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}
