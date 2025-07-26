import React from 'react';

// Improved vertical stepper navigation
export default function TabNavigation({ activeTab, onTabChange, tabs }) {
  return (
    <nav className="stepper-nav" aria-label="Order Steps">
      {tabs.map((tab, idx) => {
        // Determine tab states
        const isActive = activeTab === tab.id;
        const isCompleted = tab.completed;
        const isLocked = tab.disabled;

        return (
          <button
            key={tab.id}
            className={`stepper-step 
              ${isActive ? 'active' : ''} 
              ${isCompleted ? 'completed' : ''} 
              ${isLocked ? 'locked' : ''}`
            }
            onClick={() => !isLocked && onTabChange(tab.id)}
            disabled={isLocked}
            aria-current={isActive ? "step" : undefined}
            aria-disabled={isLocked}
          >
            <span className="stepper-circle" aria-hidden="true">
              {isCompleted ? (
                <span className="stepper-check">✔</span>
              ) : (
                idx + 1
              )}
            </span>
            <span className="stepper-content">
              <span className="stepper-icon">{tab.icon}</span>
              <span className="stepper-label">{tab.label}</span>
              <span className="stepper-desc">{tab.desc}</span>
            </span>
            {isLocked && (
              <span className="stepper-lock" title="Complete previous step first" aria-hidden="true">🔒</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
