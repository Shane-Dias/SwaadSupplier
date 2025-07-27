// src/components/OrderGenerator/EstimatedMaterialsList.jsx
import React, { useState, useEffect } from 'react';
import { getCalculationMetadata, isAICalculated } from '../utils/recipeLogic';

export default function EstimatedMaterialsList({ ingredients, dish, quantity }) {
  const [isVisible, setIsVisible] = useState({
    header: false,
    summary: false,
    aiInfo: false,
    materials: false,
    stats: false,
    tips: false,
  });

  // Staggered animations
  useEffect(() => {
    const timers = [
      setTimeout(() => setIsVisible(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setIsVisible(prev => ({ ...prev, summary: true })), 400),
      setTimeout(() => setIsVisible(prev => ({ ...prev, aiInfo: true })), 600),
      setTimeout(() => setIsVisible(prev => ({ ...prev, materials: true })), 800),
      setTimeout(() => setIsVisible(prev => ({ ...prev, stats: true })), 1000),
      setTimeout(() => setIsVisible(prev => ({ ...prev, tips: true })), 1200),
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

  // Get metadata and filter out metadata from ingredients
  const metadata = getCalculationMetadata(ingredients);
  const isAIGenerated = isAICalculated(ingredients);
  const filteredIngredients = Object.fromEntries(
    Object.entries(ingredients).filter(([key]) => !key.startsWith('_'))
  );

  // Calculate additional stats
  const totalIngredients = Object.keys(filteredIngredients).length;
  const totalWeight = Object.values(filteredIngredients).reduce((total, ingredient) => {
    return total + (ingredient.unit === 'g' ? ingredient.totalQuantity : 0);
  }, 0);
  
  const totalVolume = Object.values(filteredIngredients).reduce((total, ingredient) => {
    return total + (ingredient.unit === 'ml' ? ingredient.totalQuantity : 0);
  }, 0);

  const totalPieces = Object.values(filteredIngredients).reduce((total, ingredient) => {
    return total + (ingredient.unit === 'pieces' ? ingredient.totalQuantity : 0);
  }, 0);

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className={`text-center space-y-4 ${fadeClass('header')}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-sm text-orange-200/80 tracking-wide font-medium">
            {isAIGenerated ? '🤖 AI-Calculated Materials' : '📦 Calculated Materials'}
          </span>
        </div>
        
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-red-300">
          Raw Materials Required
        </h3>
        <p className="text-white/60 text-lg">
          {isAIGenerated 
            ? 'Precise ingredients calculated by Gemini AI for your order'
            : 'Ingredients calculated using our recipe database'
          }
        </p>
      </div>

      {/* Order Summary */}
      <div className={`${fadeClass('summary')}`}>
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-6">
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
            
            {/* Calculation Method Badge */}
            <div className={`px-4 py-2 rounded-full border ${
              isAIGenerated 
                ? 'bg-green-500/20 border-green-500/30 text-green-300'
                : 'bg-blue-500/20 border-blue-500/30 text-blue-300'
            }`}>
              <div className="flex items-center space-x-2 text-sm font-medium">
                <span>{isAIGenerated ? '🤖' : '📚'}</span>
                <span>{isAIGenerated ? 'AI Generated' : 'Recipe Based'}</span>
              </div>
            </div>
          </div>
          
          <p className="text-white/70 mb-4">
            {isAIGenerated 
              ? 'Based on advanced AI analysis of authentic recipes, here are the exact ingredients and quantities needed for your order'
              : 'Based on our curated recipe database, here are the ingredients and quantities needed for your order'
            }
          </p>

          {/* Order Metadata */}
          {metadata.estimatedCost && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-orange-500/20">
              <div className="text-center">
                <div className="text-orange-300 font-bold text-lg">₹{metadata.estimatedCost.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Estimated Cost</div>
              </div>
              <div className="text-center">
                <div className="text-orange-300 font-bold text-lg">{metadata.preparationTime} min</div>
                <div className="text-white/60 text-sm">Prep Time</div>
              </div>
              <div className="text-center">
                <div className={`font-bold text-lg capitalize ${
                  metadata.difficultyLevel === 'easy' ? 'text-green-300' :
                  metadata.difficultyLevel === 'medium' ? 'text-yellow-300' :
                  'text-red-300'
                }`}>
                  {metadata.difficultyLevel}
                </div>
                <div className="text-white/60 text-sm">Difficulty</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Section (only if AI-generated) */}
      {isAIGenerated && (
        <div className={`${fadeClass('aiInfo')}`}>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
                🧠
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">AI Analysis Complete</h4>
                <p className="text-blue-200/80 text-sm">Powered by Google Gemini AI</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white font-medium text-sm">Authentic Recipe Analysis</span>
                </div>
                <p className="text-white/60 text-xs">AI analyzed traditional cooking methods for accurate ratios</p>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white font-medium text-sm">Wastage Optimization</span>
                </div>
                <p className="text-white/60 text-xs">Quantities include 5-10% buffer for cooking losses</p>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white font-medium text-sm">Market Price Analysis</span>
                </div>
                <p className="text-white/60 text-xs">Cost estimates based on current market rates</p>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-white font-medium text-sm">Quality Validation</span>
                </div>
                <p className="text-white/60 text-xs">AI double-checked calculations for accuracy</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Materials Grid */}
      <div className={`${fadeClass('materials')}`}>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-2xl font-bold text-white flex items-center space-x-2">
            <span>🥘</span>
            <span>Ingredient Breakdown</span>
          </h4>
          <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-medium">
            {totalIngredients} ingredients
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(filteredIngredients).map(([ingredient, details], index) => {
            const category = details.category || 'other';
            const categoryIcons = {
              vegetable: '🥬',
              spice: '🌶️',
              oil: '🫒',
              grain: '🌾',
              dairy: '🥛',
              protein: '🍖',
              condiment: '🧂',
              herb: '🌿',
              other: '🥘'
            };

            return (
              <div 
                key={ingredient} 
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{categoryIcons[category]}</span>
                    <div>
                      <h5 className="text-lg font-semibold text-white">
                        {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                      </h5>
                      <span className="text-xs text-white/50 capitalize">{category}</span>
                    </div>
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
            );
          })}
        </div>
      </div>

      {/* Enhanced Order Stats */}
      <div className={`${fadeClass('stats')}`}>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>Order Statistics</span>
            </h4>
            <p className="text-white/60 text-sm mt-2">Complete breakdown of your order requirements</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center text-2xl mx-auto">
                🥘
              </div>
              <div className="text-3xl font-bold text-orange-300">
                {totalIngredients}
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
                {totalWeight > 0 ? `${totalWeight.toLocaleString()}g` : '0g'}
              </div>
              <div className="text-white/60 text-sm">Total Weight</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center text-2xl mx-auto">
                🥤
              </div>
              <div className="text-3xl font-bold text-orange-300">
                {totalVolume > 0 ? `${totalVolume.toLocaleString()}ml` : '0ml'}
              </div>
              <div className="text-white/60 text-sm">Total Volume</div>
            </div>

            {totalPieces > 0 && (
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center text-2xl mx-auto">
                  📦
                </div>
                <div className="text-3xl font-bold text-orange-300">
                  {totalPieces.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm">Total Pieces</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Preparation Tips */}
      <div className={`${fadeClass('tips')}`}>
        <div className="text-center mb-6">
          <h4 className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
            <span>💡</span>
            <span>{isAIGenerated ? 'AI-Powered Tips' : 'Expert Tips'}</span>
          </h4>
          <p className="text-white/60 mt-2">
            {isAIGenerated 
              ? 'Smart recommendations generated by AI for optimal results'
              : 'Expert recommendations for your order'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '⏰',
              title: 'Optimal Timing',
              description: isAIGenerated 
                ? `Based on AI analysis, start preparation ${Math.ceil(metadata.preparationTime / 60)} hours before serving`
                : 'Place orders 24-48 hours before needed to ensure availability'
            },
            {
              icon: '🌡️',
              title: 'Storage Optimization',
              description: isAIGenerated
                ? 'AI recommends storing perishables at optimal temperatures based on ingredient analysis'
                : 'Check storage conditions for perishable ingredients'
            },
            {
              icon: '📝',
              title: 'Quality Assurance',
              description: isAIGenerated
                ? 'AI-calculated quantities include quality buffers - verify ingredient freshness upon delivery'
                : 'Verify ingredient quality upon delivery'
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

      {/* Calculation Info Footer */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-white/60">Calculated:</span>
            <span className="text-white">
              {new Date(metadata.calculatedAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white/60">Method:</span>
            <span className={`font-medium ${isAIGenerated ? 'text-green-300' : 'text-blue-300'}`}>
              {isAIGenerated ? 'Gemini AI' : 'Recipe Database'}
            </span>
          </div>
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
