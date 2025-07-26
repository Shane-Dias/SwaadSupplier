// src/components/OrderGenerator/OrderCart.jsx
import React, { useState, useEffect } from 'react';

export default function OrderCart({ 
  ingredients, 
  selectedSuppliers, 
  suppliersData, 
  dish, 
  quantity 
}) {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (!ingredients || !selectedSuppliers || !suppliersData) return;

    const items = [];
    let total = 0;

    Object.entries(ingredients).forEach(([ingredient, details]) => {
      const supplierId = selectedSuppliers[ingredient];
      const suppliers = suppliersData[ingredient] || [];
      const supplier = suppliers.find(s => s.id === supplierId);

      if (supplier) {
        const requiredKg = details.totalQuantity / 1000; // Convert grams to kg
        const requiredLiters = details.unit === 'ml' ? details.totalQuantity / 1000 : 0;
        const requiredQuantity = details.unit === 'ml' ? requiredLiters : requiredKg;
        
        const itemCost = requiredQuantity * supplier.price;
        total += itemCost;

        items.push({
          ingredient,
          supplier: supplier.name,
          supplierId: supplier.id,
          requiredQuantity: Math.ceil(requiredQuantity * 100) / 100, // Round up to 2 decimals
          unit: supplier.unit,
          pricePerUnit: supplier.price,
          totalCost: Math.ceil(itemCost * 100) / 100,
          originalQuantity: details.totalQuantity,
          originalUnit: details.unit
        });
      }
    });

    setCartItems(items);
    setTotalCost(Math.ceil(total * 100) / 100);
  }, [ingredients, selectedSuppliers, suppliersData]);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...cartItems];
    updatedItems[index].requiredQuantity = parseFloat(newQuantity) || 0;
    updatedItems[index].totalCost = updatedItems[index].requiredQuantity * updatedItems[index].pricePerUnit;
    
    setCartItems(updatedItems);
    
    const newTotal = updatedItems.reduce((sum, item) => sum + item.totalCost, 0);
    setTotalCost(Math.ceil(newTotal * 100) / 100);
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert('No items in cart');
      return;
    }

    const orderData = {
      dish,
      quantity,
      items: cartItems,
      totalCost,
      orderDate: new Date().toISOString()
    };

    console.log('Placing order:', orderData);
    alert(`Order placed successfully! Total: ₹${totalCost}`);
    
    // Here you would typically send the order to your backend
    // Example: await placeOrder(orderData);
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="order-cart">
      <h3>🛒 Auto-Generated Order Cart</h3>
      <p className="cart-summary">Order for {quantity} plates of {dish}</p>
      
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={`${item.ingredient}-${item.supplierId}`} className="cart-item">
            <div className="item-header">
              <span className="ingredient-name">{item.ingredient.toUpperCase()}</span>
              <span className="supplier-name">from {item.supplier}</span>
            </div>
            
            <div className="item-details">
              <div className="quantity-input">
                <label>Quantity:</label>
                <input 
                  type="number"
                  value={item.requiredQuantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  min="0"
                  step="0.1"
                />
                <span>{item.unit}</span>
              </div>
              
              <div className="pricing">
                <span className="price-per-unit">₹{item.pricePerUnit}/{item.unit}</span>
                <span className="total-price">₹{item.totalCost}</span>
              </div>
            </div>
            
            <div className="required-info">
              Required: {item.originalQuantity} {item.originalUnit}
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-footer">
        <div className="total-cost">
          <strong>Total: ₹{totalCost}</strong>
        </div>
        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}
