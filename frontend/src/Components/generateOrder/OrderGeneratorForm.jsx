// src/components/OrderGenerator/OrderGeneratorForm.jsx
import React, { useState, useEffect } from 'react';
import { calculateIngredients, getAvailableRecipes } from '../../utils/recipeLogic';

export default function OrderGeneratorForm({ onGenerate }) {
  const [dish, setDish] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isVisible, setIsVisible] = useState({
    header: false,
    form: false,
    features: false,
    guide: false,
  });

  const availableRecipes = getAvailableRecipes();

  // Staggered animations
  useEffect(() => {
    const timers = [
      setTimeout(() => setIsVisible(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setIsVisible(prev => ({ ...prev, form: true })), 400),
      setTimeout(() => setIsVisible(prev => ({ ...prev, features: true })), 600),
      setTimeout(() => setIsVisible(prev => ({ ...prev, guide: true })), 800),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
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
      // AI calculation with loading messages
      const loadingMessages = [
        '🤖 Initializing AI chef assistant...',
        '📚 Analyzing traditional recipes...',
        '⚖️ Calculating precise quantities...',
        '🧮 Optimizing ingredient ratios...',
        '💰 Estimating market costs...',
        '✨ Finalizing calculations...'
      ];
      
      let messageIndex = 0;
      setLoadingMessage(loadingMessages[0]);
      
      // Update loading message every 800ms
      const messageInterval = setInterval(() => {
        if (messageIndex < loadingMessages.length - 1) {
          messageIndex++;
          setLoadingMessage(loadingMessages[messageIndex]);
        }
      }, 800);
      
      console.log(`🚀 Starting AI calculation for ${quantity} plates of ${dish}`);
      
      // Call the enhanced calculateIngredients function (now async)
      const ingredients = await calculateIngredients(dish, Number(quantity));
      
      clearInterval(messageInterval);
      
      if (ingredients.error) {
        console.error('❌ Calculation error:', ingredients.error);
        alert(ingredients.error);
        return;
      }

      // Check if calculation was successful
      const metadata = ingredients._metadata || {};
      const isAICalculated = metadata.source === 'gemini-ai';
      
      if (isAICalculated) {
        console.log('✅ Successfully calculated using Gemini AI');
        setLoadingMessage('🎉 AI calculation completed!');
      } else {
        console.log('⚠️ Used fallback calculation');
        setLoadingMessage('✅ Calculation completed using backup system');
      }

      // Brief success message display
      setTimeout(() => setLoadingMessage(''), 1000);

      // Prepare data for the next step
      const orderData = {
        dish,
        quantity: Number(quantity),
        ingredients,
        estimatedCost: metadata.estimatedCost || 0,
        preparationTime: metadata.preparationTime || 60,
        difficultyLevel: metadata.difficultyLevel || 'medium',
        calculationSource: metadata.source || 'unknown',
        calculatedAt: metadata.calculatedAt || new Date().toISOString()
      };

      console.log('📋 Order data prepared:', orderData);
      onGenerate(orderData);

    } catch (error) {
      console.error('💥 Error in form submission:', error);
      alert('Failed to calculate ingredients. Please try again or contact support.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleReset = () => {
    setDish('');
    setQuantity('');
    setLoadingMessage('');
  };

  // Enhanced quantity validation with real-time feedback
  const getQuantityFeedback = () => {
    if (!quantity) return null;
    
    const num = parseInt(quantity);
    if (num < 1) return { type: 'error', message: 'Minimum 1 plate required' };
    if (num > 1000) return { type: 'error', message: 'Maximum 1000 plates allowed' };
    if (num <= 10) return { type: 'info', message: 'Perfect for small gatherings' };
    if (num <= 50) return { type: 'success', message: 'Great for medium events' };
    if (num <= 200) return { type: 'warning', message: 'Large order - ensure advance planning' };
    return { type: 'warning', message: 'Very large order - contact for bulk pricing' };
  };

  const quantityFeedback = getQuantityFeedback();

  const fadeClass = (element) =>
    `transition-all duration-1000 transform ${
      isVisible[element]
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10"
    }`;

  return (
    <div className="p-8 space-y-8">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-sm">
          <div className="text-6xl mb-6 animate-bounce">🤖</div>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-orange-200 font-medium text-lg animate-pulse">{loadingMessage}</p>
        </div>
      )}

      {/* Header Section */}
      <div className={`text-center space-y-4 ${fadeClass('header')}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-sm text-orange-200/80 tracking-wide font-medium">
            🤖 AI-Powered Order Generator
          </span>
        </div>
        
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-red-300">
          Generate Your Order
        </h3>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Tell us what you want to cook, and our AI will calculate everything you need with precision
        </p>
      </div>
      
      {/* Main Form */}
      <div className={`max-w-2xl mx-auto ${fadeClass('form')}`}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-8">
            {/* Dish Selection */}
            <div className="space-y-4">
              <label className="block">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">🍽️</span>
                  <div>
                    <span className="text-lg font-semibold text-white">What dish are you making?</span>
                    <p className="text-sm text-white/60">Select from our curated list of popular dishes</p>
                  </div>
                </div>
                
                <div className="relative">
                  <select 
                    value={dish} 
                    onChange={(e) => setDish(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-300 appearance-none cursor-pointer hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      colorScheme: 'dark',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff'
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>
                      Select a dish...
                    </option>
                    {availableRecipes.map(recipe => (
                      <option 
                        key={recipe} 
                        value={recipe} 
                        style={{ backgroundColor: '#1f2937', color: '#ffffff' }}
                      >
                        {recipe.charAt(0).toUpperCase() + recipe.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-white/40">
                      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {dish && (
                  <div className="mt-3 flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 animate-fadeInUp">
                    <span className="text-green-400">✅</span>
                    <span className="text-green-300 font-medium">Selected: {dish.charAt(0).toUpperCase() + dish.slice(1)}</span>
                    <span className="text-green-400">🤖</span>
                    <span className="text-green-200 text-sm">AI will calculate precise ingredients</span>
                  </div>
                )}
              </label>
            </div>

            {/* Quantity Input */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">📊</span>
                <div>
                  <span className="text-lg font-semibold text-white">How many plates?</span>
                  <p className="text-sm text-white/60">Enter the number of servings you need</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white/5 border border-white/20 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    className="px-4 py-4 bg-white/5 hover:bg-white/10 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setQuantity(prev => Math.max(1, (parseInt(prev) || 1) - 1))}
                    disabled={loading || parseInt(quantity) <= 1}
                  >
                    −
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="50"
                    min="1"
                    max="1000"
                    required
                    disabled={loading}
                    className="w-24 px-4 py-4 bg-transparent text-white text-center focus:outline-none border-x border-white/20 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    className="px-4 py-4 bg-white/5 hover:bg-white/10 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setQuantity(prev => Math.min(1000, (parseInt(prev) || 0) + 1))}
                    disabled={loading || parseInt(quantity) >= 1000}
                  >
                    +
                  </button>
                </div>
                <span className="text-white/60 font-medium">plates</span>
              </div>
              
              {/* Quantity Feedback */}
              {quantityFeedback && (
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                  quantityFeedback.type === 'error' ? 'bg-red-500/10 border-red-500/20' :
                  quantityFeedback.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                  quantityFeedback.type === 'success' ? 'bg-green-500/10 border-green-500/20' :
                  'bg-blue-500/10 border-blue-500/20'
                }`}>
                  <span className={
                    quantityFeedback.type === 'error' ? 'text-red-400' :
                    quantityFeedback.type === 'warning' ? 'text-yellow-400' :
                    quantityFeedback.type === 'success' ? 'text-green-400' :
                    'text-blue-400'
                  }>
                    {quantityFeedback.type === 'error' ? '⚠️' :
                     quantityFeedback.type === 'warning' ? '⚡' :
                     quantityFeedback.type === 'success' ? '✅' : 'ℹ️'}
                  </span>
                  <span className={`text-sm font-medium ${
                    quantityFeedback.type === 'error' ? 'text-red-300' :
                    quantityFeedback.type === 'warning' ? 'text-yellow-300' :
                    quantityFeedback.type === 'success' ? 'text-green-300' :
                    'text-blue-300'
                  }`}>
                    {quantityFeedback.message}
                  </span>
                </div>
              )}
              
              {quantity && parseInt(quantity) > 0 && (
                <div className="bg-white/5 border border-white/20 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Estimated cost:</span>
                    <span className="text-orange-300 font-bold">₹{(parseInt(quantity) * 45).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Preparation time:</span>
                    <span className="text-orange-300 font-bold">{Math.ceil(parseInt(quantity) / 20)} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">AI calculation:</span>
                    <span className="text-green-300 font-bold flex items-center space-x-1">
                      <span>🤖</span>
                      <span>Precise & Optimized</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              type="button" 
              onClick={handleReset}
              disabled={loading || (!dish && !quantity)}
              className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>🔄</span>
              <span>Reset</span>
            </button>
            
            <button 
              type="submit" 
              disabled={loading || !dish || !quantity || (quantityFeedback && quantityFeedback.type === 'error')} 
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calculating with AI...</span>
                </>
              ) : (
                <>
                  <span>🤖</span>
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Enhanced Feature Highlights */}
      <div className={`${fadeClass('features')}`}>
        <div className="text-center mb-8">
          <h4 className="text-2xl font-bold text-white mb-2">🤖 Why Choose Our AI Generator?</h4>
          <p className="text-white/60">Powered by advanced Gemini AI to make your ordering process seamless</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: '🧠',
              title: 'AI-Powered Precision',
              desc: 'Gemini AI analyzes authentic recipes for exact quantities',
              benefit: 'Zero guesswork'
            },
            {
              icon: '⚡',
              title: 'Instant Calculation',
              desc: 'Get precise ingredients in seconds, not hours',
              benefit: 'Save 95% time'
            },
            {
              icon: '🎯',
              title: 'Perfect Portions',
              desc: 'Optimized ratios for consistent taste every time',
              benefit: 'Zero food waste'
            },
            {
              icon: '💰',
              title: 'Smart Cost Analysis',
              desc: 'AI estimates realistic market prices automatically',
              benefit: 'Budget planning'
            },
            {
              icon: '📊',
              title: 'Real-time Validation',
              desc: 'AI double-checks calculations for accuracy',
              benefit: 'Trusted results'
            },
            {
              icon: '🔄',
              title: 'Adaptive Learning',
              desc: 'AI improves with every calculation for better results',
              benefit: 'Always improving'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h5 className="text-lg font-semibold text-white mb-2">{feature.title}</h5>
              <p className="text-white/70 text-sm mb-3">{feature.desc}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
                <span className="text-orange-300 text-xs font-medium">{feature.benefit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Quick Start Guide */}
      <div className={`${fadeClass('guide')}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h4 className="text-2xl font-bold text-white mb-2">🚀 How It Works</h4>
            <p className="text-white/60">Our AI-powered process in simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                number: '1',
                title: 'Select Dish',
                desc: 'Choose from 20+ popular Indian street food dishes',
                icon: '🍽️'
              },
              {
                number: '2',
                title: 'Enter Quantity',
                desc: 'Specify plates needed (1-1000 supported)',
                icon: '📊'
              },
              {
                number: '3',
                title: 'AI Processing',
                desc: 'Gemini AI calculates precise ingredients instantly',
                icon: '🤖'
              },
              {
                number: '4',
                title: 'Get Results',
                desc: 'Receive optimized shopping list with costs',
                icon: '✨'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
                    {step.number}
                  </div>
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <h5 className="text-lg font-semibold text-white mb-2">{step.title}</h5>
                  <p className="text-white/70 text-sm">{step.desc}</p>
                </div>
                
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-orange-400">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Status Indicator */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-300 text-sm font-medium">🤖 Gemini AI Ready</span>
          <span className="text-green-400">•</span>
          <span className="text-green-200 text-xs">Advanced ingredient calculation enabled</span>
        </div>
      </div>
    </div>
  );
}
