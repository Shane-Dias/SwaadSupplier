// src/components/OrderGenerator/EstimatedMaterialsList.jsx
import React, { useState, useEffect } from 'react';

export default function EstimatedMaterialsList({ ingredients, dish, quantity }) {
  const [isVisible, setIsVisible] = useState({
    header: false,
    summary: false,
    materials: false,
    stats: false,
    tips: false,
  });

  // Staggered animations
  useEffect(() => {
    const timers = [
      setTimeout(() => setIsVisible(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setIsVisible(prev => ({ ...prev, summary: true })), 400),
      setTimeout(() => setIsVisible(prev => ({ ...prev, materials: true })), 600),
      setTimeout(() => setIsVisible(prev => ({ ...prev, stats: true })), 800),
      setTimeout(() => setIsVisible(prev => ({ ...prev, tips: true })), 1000),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const fadeClass = (element) =>
    `transition-all duration-1000 transform ${
      isVisible[element]
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10"
    }`;

  if (!ingredients || Object.keys(ingredients).length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-white">No Ingredients Data</h3>
          <p className="text-white/60">Please generate an order first to see the materials list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className={`text-center space-y-4 ${fadeClass('header')}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-sm text-orange-200/80 tracking-wide font-medium">
            📦 AI-Calculated Materials
          </span>
        </div>
        
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-red-300">
          Raw Materials Required
        </h3>
        <p className="text-white/60 text-lg">
          Precise ingredients calculated by our AI for your order
        </p>
      </div>

      {/* Order Summary */}
      <div className={`${fadeClass('summary')}`}>
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-6 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-2xl">
              🍽️
            </div>
            <div>
              <h4 className="text-2xl font-bold text-white">
                {dish.charAt(0).toUpperCase() + dish.slice(1)}
              </h4>
              <p className="text-orange-200/80 text-lg">{quantity} plates</p>
            </div>
          </div>
          <p className="text-white/70">
            Based on our AI analysis, here are the exact ingredients and quantities needed for your order
          </p>
        </div>
      </div>

      {/* Materials Grid */}
      <div className={`${fadeClass('materials')}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(ingredients).map(([ingredient, details], index) => (
            <div 
              key={ingredient} 
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🥘</span>
                  <h5 className="text-lg font-semibold text-white">
                    {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                  </h5>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-medium">
                  Required
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Total Quantity</div>
                  <div className="text-2xl font-bold text-orange-300">
                    {details.totalQuantity} {details.unit}
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Per Plate</div>
                  <div className="text-lg font-semibold text-white">
                    {details.quantityPerPlate} {details.unit}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="text-xs text-orange-200/80 text-center">
                  {details.quantityPerPlate} {details.unit} × {quantity} plates = {details.totalQuantity} {details.unit}
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-300 text-sm font-medium">Ready for supplier selection</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Stats */}
      <div className={`${fadeClass('stats')}`}>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>Order Statistics</span>
            </h4>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center text-2xl mx-auto">
                🥘
              </div>
              <div className="text-3xl font-bold text-orange-300">
                {Object.keys(ingredients).length}
              </div>
              <div className="text-white/60 text-sm">Unique Ingredients</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center text-2xl mx-auto">
                📏
              </div>
              <div className="text-3xl font-bold text-orange-300">{quantity}</div>
              <div className="text-white/60 text-sm">Total Plates</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center text-2xl mx-auto">
                ⚖️
              </div>
              <div className="text-3xl font-bold text-orange-300">
                {Object.values(ingredients).reduce((total, ingredient) => {
                  return total + (ingredient.unit === 'g' ? ingredient.totalQuantity : 0);
                }, 0).toLocaleString()}g
              </div>
              <div className="text-white/60 text-sm">Total Weight</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center text-2xl mx-auto">
                🥤
              </div>
              <div className="text-3xl font-bold text-orange-300">
                {Object.values(ingredients).reduce((total, ingredient) => {
                  return total + (ingredient.unit === 'ml' ? ingredient.totalQuantity : 0);
                }, 0).toLocaleString()}ml
              </div>
              <div className="text-white/60 text-sm">Total Volume</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preparation Tips */}
      <div className={`${fadeClass('tips')}`}>
        <div className="text-center mb-6">
          <h4 className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
            <span>💡</span>
            <span>Preparation Tips</span>
          </h4>
          <p className="text-white/60 mt-2">Expert recommendations for your order</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '⏰',
              title: 'Order in Advance',
              description: 'Place orders 24-48 hours before needed to ensure availability'
            },
            {
              icon: '🌡️',
              title: 'Storage Requirements',
              description: 'Check storage conditions for perishable ingredients'
            },
            {
              icon: '📝',
              title: 'Quality Check',
              description: 'Verify ingredient quality upon delivery'
            }
          ].map((tip, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="text-4xl mb-4 text-center">{tip.icon}</div>
              <h5 className="text-lg font-semibold text-white mb-3 text-center">{tip.title}</h5>
              <p className="text-white/70 text-sm text-center leading-relaxed">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step Indicator */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
          <span className="text-orange-300">✨</span>
          <span className="text-white font-medium">Ready to select suppliers for these ingredients</span>
          <span className="text-orange-300">→</span>
        </div>
      </div>
    </div>
  );
}
