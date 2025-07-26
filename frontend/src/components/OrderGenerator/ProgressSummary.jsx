// src/components/OrderGenerator/ProgressSummary.jsx
import React, { useState, useEffect } from 'react';

export default function ProgressSummary({ orderData, selectedSuppliers, totalCost }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Move all hooks to the top level, before any early returns
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Calculate values before early return
  const suppliersSelected = orderData ? Object.keys(selectedSuppliers).length : 0;
  const totalIngredients = orderData ? Object.keys(orderData.ingredients).length : 0;
  const completionPercentage = totalIngredients > 0 ? Math.round((suppliersSelected / totalIngredients) * 100) : 0;

  // Animate progress bar when percentage changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(completionPercentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [completionPercentage]);

  // Early return AFTER all hooks
  if (!orderData) return null;

  const fadeClass = `transition-all duration-1000 transform ${
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  }`;

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 ${fadeClass}`}>
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-white flex items-center space-x-2">
          <span className="text-orange-400">📊</span>
          <span>Order Progress</span>
        </h4>
        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
          <span className="text-orange-300 font-bold text-sm">{completionPercentage}%</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between text-xs text-white/60 mt-2">
          <span>Getting started</span>
          <span>Ready to order</span>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="space-y-3">
        {/* Dish Info */}
        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
            <span className="text-lg">🍽️</span>
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold">
              {orderData.dish.charAt(0).toUpperCase() + orderData.dish.slice(1)}
            </div>
            <div className="text-orange-200/80 text-sm">{orderData.quantity} plates</div>
          </div>
        </div>
        
        {/* Ingredients */}
        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
            <span className="text-lg">📦</span>
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold">{totalIngredients}</div>
            <div className="text-white/60 text-sm">ingredients needed</div>
          </div>
        </div>
        
        {/* Suppliers */}
        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
            <span className="text-lg">🏪</span>
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold">
              {suppliersSelected}/{totalIngredients}
            </div>
            <div className="text-white/60 text-sm">suppliers selected</div>
          </div>
          {suppliersSelected === totalIngredients && totalIngredients > 0 && (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        
        {/* Total Cost */}
        {totalCost > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-500/40 flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
                ₹{totalCost.toLocaleString()}
              </div>
              <div className="text-orange-200/80 text-sm">estimated total</div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-yellow-300 text-xs font-medium">Live</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
        {completionPercentage === 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-blue-400">ℹ️</span>
            <span className="text-blue-200 text-sm">Start by selecting suppliers for your ingredients</span>
          </div>
        )}
        {completionPercentage > 0 && completionPercentage < 100 && (
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">⚡</span>
            <span className="text-yellow-200 text-sm">
              {totalIngredients - suppliersSelected} more suppliers needed to complete your order
            </span>
          </div>
        )}
        {completionPercentage === 100 && (
          <div className="flex items-center space-x-2">
            <span className="text-green-400">✅</span>
            <span className="text-green-200 text-sm">Perfect! All suppliers selected. Ready to place order.</span>
          </div>
        )}
      </div>
    </div>
  );
}
