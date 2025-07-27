// src/components/OrderGenerator/TabNavigation.jsx
import React, { useState, useEffect } from 'react';

export default function TabNavigation({ activeTab, onTabChange, tabs }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Staggered animations
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Calculate progress
  const completedTabs = tabs.filter(tab => tab.completed).length;
  const progressPercentage = Math.round((completedTabs / tabs.length) * 100);

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const fadeClass = `transition-all duration-1000 transform ${
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  }`;

  return (
    <div className={`space-y-6 ${fadeClass}`}>
      {/* Navigation Title */}
      <div className="text-center">
        <h4 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-red-300 flex items-center justify-center space-x-2">
          <span>🎯</span>
          <span>Order Progress</span>
        </h4>
      </div>
      
      {/* Stepper Navigation */}
      <nav className="space-y-4" aria-label="Order Steps">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          const isCompleted = tab.completed;
          const isLocked = tab.disabled;

          return (
            <div key={tab.id} className="relative">
              <button
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 ring-2 ring-orange-500/30' 
                    : isCompleted
                    ? 'bg-green-500/10 border border-green-500/30 hover:bg-green-500/20'
                    : isLocked
                    ? 'bg-white/5 border border-white/10 opacity-50 cursor-not-allowed'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
                onClick={() => !isLocked && onTabChange(tab.id)}
                disabled={isLocked}
                aria-current={isActive ? "step" : undefined}
                aria-disabled={isLocked}
                title={isLocked ? "Complete previous step first" : `Go to ${tab.label}`}
              >
                <div className="flex items-center space-x-4">
                  {/* Step Circle */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : isLocked
                      ? 'bg-white/10 text-white/40'
                      : 'bg-white/20 text-white/70'
                  }`}>
                    {isCompleted ? (
                      <span>✔</span>
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl" aria-hidden="true">{tab.icon}</span>
                      <span className={`font-semibold text-lg ${
                        isActive ? 'text-white' : isCompleted ? 'text-green-300' : isLocked ? 'text-white/40' : 'text-white/80'
                      }`}>
                        {tab.label}
                      </span>
                    </div>
                    
                    <p className={`text-sm leading-relaxed ${
                      isActive ? 'text-orange-200/80' : isCompleted ? 'text-green-200/70' : isLocked ? 'text-white/30' : 'text-white/60'
                    }`}>
                      {tab.desc}
                    </p>
                    
                    {/* Status Badge */}
                    <div className="flex items-center space-x-2 mt-2">
                      {isActive && (
                        <span className="px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-medium flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                          <span>Current Step</span>
                        </span>
                      )}
                      {isCompleted && !isActive && (
                        <span className="px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-medium flex items-center space-x-1">
                          <span>✓</span>
                          <span>Completed</span>
                        </span>
                      )}
                      {isLocked && (
                        <span className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-white/50 text-xs font-medium flex items-center space-x-1">
                          <span>🔒</span>
                          <span>Locked</span>
                        </span>
                      )}
                      {!isActive && !isCompleted && !isLocked && (
                        <span className="px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium">
                          Available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Active Step Indicator */}
                  {isActive && (
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse" />
                  )}
                </div>
              </button>

              {/* Progress Connector */}
              {idx < tabs.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className={`w-1 h-6 rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-gradient-to-b from-green-500 to-emerald-500' : 'bg-white/20'
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Overall Progress Bar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold flex items-center space-x-2">
            <span>📊</span>
            <span>Overall Progress</span>
          </span>
          <span className="text-orange-300 font-bold text-lg">
            {progressPercentage}%
          </span>
        </div>
        
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 animate-pulse" />
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-white/60">
          <span>{completedTabs} of {tabs.length} steps completed</span>
          <span>
            {completedTabs === tabs.length ? 'All Done! 🎉' : `${tabs.length - completedTabs} steps remaining`}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      {completedTabs > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <span className="text-orange-300">✨</span>
            <span className="text-white text-sm font-medium">
              {completedTabs === tabs.length ? 'Ready to place order!' : 'Keep going, you\'re doing great!'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
