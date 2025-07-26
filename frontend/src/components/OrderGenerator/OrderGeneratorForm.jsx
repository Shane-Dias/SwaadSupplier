// src/components/OrderGenerator/OrderGeneratorForm.jsx
import React, { useState } from 'react';
import { calculateIngredients, getAvailableRecipes } from '../../utils/recipeLogic';

export default function OrderGeneratorForm({ onGenerate }) {
  const [dish, setDish] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const availableRecipes = getAvailableRecipes();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dish || !quantity) {
      alert('Please fill in both dish name and quantity');
      return;
    }

    setLoading(true);
    
    try {
      const ingredients = calculateIngredients(dish, Number(quantity));
      
      if (ingredients.error) {
        alert(ingredients.error);
        return;
      }

      onGenerate({
        dish,
        quantity: Number(quantity),
        ingredients
      });
    } catch (error) {
      console.error('Error generating order:', error);
      alert('Failed to generate order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uniform-tab-content">
      <div className="tab-header-section">
        <h3>🎯 Generate Your Order</h3>
        <p>Tell us what you want to cook, and we'll calculate everything you need</p>
      </div>
      
      <div className="tab-main-content">
        <form onSubmit={handleSubmit} className="uniform-form">
          <div className="uniform-form-group">
            <label htmlFor="dish" className="uniform-label">
              <span className="label-icon">🍽️</span>
              What dish are you making?
            </label>
            <select 
              id="dish"
              value={dish} 
              onChange={(e) => setDish(e.target.value)}
              required
              className="uniform-select"
            >
              <option value="">Select a dish...</option>
              {availableRecipes.map(recipe => (
                <option key={recipe} value={recipe}>
                  {recipe.charAt(0).toUpperCase() + recipe.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="uniform-form-group">
            <label htmlFor="quantity" className="uniform-label">
              <span className="label-icon">📊</span>
              How many plates?
            </label>
            <div className="uniform-input-group">
              <input 
                id="quantity"
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter number of plates"
                min="1"
                max="1000"
                required
                className="uniform-input"
              />
              <span className="uniform-suffix">plates</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="uniform-submit-btn">
            {loading ? (
              <>
                <span className="btn-spinner">⏳</span>
                Calculating ingredients...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                Generate Order
              </>
            )}
          </button>
        </form>

        <div className="tab-features-grid">
          <div className="uniform-feature-card">
            <span className="feature-icon">⚡</span>
            <div className="feature-content">
              <div className="feature-title">Instant Calculation</div>
              <div className="feature-desc">AI calculates exact ingredients needed</div>
            </div>
          </div>
          <div className="uniform-feature-card">
            <span className="feature-icon">🏪</span>
            <div className="feature-content">
              <div className="feature-title">Best Suppliers</div>
              <div className="feature-desc">Find nearby suppliers with best prices</div>
            </div>
          </div>
          <div className="uniform-feature-card">
            <span className="feature-icon">🛒</span>
            <div className="feature-content">
              <div className="feature-title">Auto-Fill Cart</div>
              <div className="feature-desc">Pre-filled cart ready for checkout</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
