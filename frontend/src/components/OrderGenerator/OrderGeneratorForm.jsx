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

    if (quantity < 1 || quantity > 1000) {
      alert('Quantity must be between 1 and 1000 plates');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  const handleReset = () => {
    setDish('');
    setQuantity('');
  };

  return (
    <div className="uniform-tab-content">
      <div className="tab-header-section">
        <h3>🎯 Generate Your Order</h3>
        <p>Tell us what you want to cook, and we'll calculate everything you need</p>
      </div>
      
      <div className="tab-main-content">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-sections">
            {/* Dish Selection */}
            <div className="form-section">
              <label htmlFor="dish" className="form-label">
                <span className="label-icon">🍽️</span>
                <div className="label-content">
                  <span className="label-title">What dish are you making?</span>
                  <span className="label-description">Select from our curated list of popular dishes</span>
                </div>
              </label>
              
              <div className="select-wrapper">
                <select 
                  id="dish"
                  value={dish} 
                  onChange={(e) => setDish(e.target.value)}
                  required
                  className="form-select"
                  disabled={loading}
                >
                  <option value="">Select a dish...</option>
                  {availableRecipes.map(recipe => (
                    <option key={recipe} value={recipe}>
                      {recipe.charAt(0).toUpperCase() + recipe.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="select-arrow">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {dish && (
                <div className="selection-preview">
                  <span className="preview-icon">✅</span>
                  <span className="preview-text">Selected: {dish.charAt(0).toUpperCase() + dish.slice(1)}</span>
                </div>
              )}
            </div>

            {/* Quantity Input */}
            <div className="form-section">
              <label htmlFor="quantity" className="form-label">
                <span className="label-icon">📊</span>
                <div className="label-content">
                  <span className="label-title">How many plates?</span>
                  <span className="label-description">Enter the number of servings you need</span>
                </div>
              </label>
              
              <div className="quantity-input-wrapper">
                <div className="quantity-controls">
                  <button
                    type="button"
                    className="quantity-btn minus"
                    onClick={() => setQuantity(prev => Math.max(1, (parseInt(prev) || 1) - 1))}
                    disabled={loading || parseInt(quantity) <= 1}
                  >
                    −
                  </button>
                  <input 
                    id="quantity"
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="50"
                    min="1"
                    max="1000"
                    required
                    className="quantity-input"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="quantity-btn plus"
                    onClick={() => setQuantity(prev => Math.min(1000, (parseInt(prev) || 0) + 1))}
                    disabled={loading || parseInt(quantity) >= 1000}
                  >
                    +
                  </button>
                </div>
                <div className="quantity-suffix">plates</div>
              </div>
              
              {quantity && parseInt(quantity) > 0 && (
                <div className="quantity-info">
                  <div className="info-row">
                    <span className="info-label">Estimated cost:</span>
                    <span className="info-value">₹{(parseInt(quantity) * 45).toLocaleString()}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Preparation time:</span>
                    <span className="info-value">{Math.ceil(parseInt(quantity) / 20)} hours</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary reset-btn"
              onClick={handleReset}
              disabled={loading || (!dish && !quantity)}
            >
              <span>🔄</span>
              Reset
            </button>
            
            <button 
              type="submit" 
              disabled={loading || !dish || !quantity} 
              className="btn btn-primary generate-btn"
            >
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
          </div>
        </form>

        {/* Feature Highlights */}
        <div className="feature-highlights">
          <div className="highlights-header">
            <h4>✨ Why Choose Our AI Generator?</h4>
          </div>
          
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-icon">⚡</div>
              <div className="highlight-content">
                <div className="highlight-title">Instant Calculation</div>
                <div className="highlight-desc">AI calculates exact ingredients needed in seconds</div>
                <div className="highlight-benefit">Save 90% planning time</div>
              </div>
            </div>
            
            <div className="highlight-card">
              <div className="highlight-icon">🎯</div>
              <div className="highlight-content">
                <div className="highlight-title">Precise Portions</div>
                <div className="highlight-desc">Perfect ingredient ratios for consistent taste</div>
                <div className="highlight-benefit">Zero food waste</div>
              </div>
            </div>
            
            <div className="highlight-card">
              <div className="highlight-icon">💰</div>
              <div className="highlight-content">
                <div className="highlight-title">Cost Optimization</div>
                <div className="highlight-desc">Compare prices from multiple suppliers</div>
                <div className="highlight-benefit">Save up to 30% on costs</div>
              </div>
            </div>
            
            <div className="highlight-card">
              <div className="highlight-icon">📱</div>
              <div className="highlight-content">
                <div className="highlight-title">Smart Templates</div>
                <div className="highlight-desc">Save orders as templates for quick reordering</div>
                <div className="highlight-benefit">Reorder in 1 click</div>
              </div>
            </div>
            
            <div className="highlight-card">
              <div className="highlight-icon">🔥</div>
              <div className="highlight-content">
                <div className="highlight-title">Real-time Updates</div>
                <div className="highlight-desc">Get live price updates from vendors</div>
                <div className="highlight-benefit">Always best prices</div>
              </div>
            </div>
            
            <div className="highlight-card">
              <div className="highlight-icon">📊</div>
              <div className="highlight-content">
                <div className="highlight-title">Analytics & Insights</div>
                <div className="highlight-desc">Track your ordering patterns and optimize</div>
                <div className="highlight-benefit">Data-driven decisions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="quick-start-guide">
          <div className="guide-header">
            <h4>🚀 Quick Start Guide</h4>
            <p>Follow these simple steps to get your first order</p>
          </div>
          
          <div className="guide-steps">
            <div className="guide-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <div className="step-title">Select Your Dish</div>
                <div className="step-desc">Choose from our curated list of popular Indian dishes</div>
              </div>
            </div>
            
            <div className="guide-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <div className="step-title">Enter Quantity</div>
                <div className="step-desc">Specify how many plates you need to prepare</div>
              </div>
            </div>
            
            <div className="guide-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <div className="step-title">Review Materials</div>
                <div className="step-desc">Check AI-calculated ingredient requirements</div>
              </div>
            </div>
            
            <div className="guide-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <div className="step-title">Choose Suppliers</div>
                <div className="step-desc">Select best suppliers based on price and quality</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
