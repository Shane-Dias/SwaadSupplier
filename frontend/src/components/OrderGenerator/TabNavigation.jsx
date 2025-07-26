// src/components/OrderGenerator/TabNavigation.jsx
import React from 'react';

export default function TabNavigation({ activeTab, onTabChange, tabs }) {
  return (
    <div className="tab-navigation-vertical">
      <div className="nav-title">Order Progress</div>
      
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
              title={isLocked ? "Complete previous step first" : `Go to ${tab.label}`}
            >
              {/* Step Circle with Number/Checkmark */}
              <div className="stepper-circle" aria-hidden="true">
                {isCompleted ? (
                  <span className="stepper-check">✔</span>
                ) : (
                  <span className="stepper-number">{idx + 1}</span>
                )}
              </div>

              {/* Step Content */}
              <div className="stepper-content">
                <div className="stepper-header">
                  <span className="stepper-icon" aria-hidden="true">{tab.icon}</span>
                  <span className="stepper-label">{tab.label}</span>
                </div>
                <div className="stepper-desc">{tab.desc}</div>
                <div className="stepper-status">
                  {isActive && <span className="status active">Current Step</span>}
                  {isCompleted && !isActive && <span className="status completed">Completed</span>}
                  {isLocked && <span className="status pending">Locked</span>}
                  {!isActive && !isCompleted && !isLocked && <span className="status available">Available</span>}
                </div>
              </div>

              {/* Lock Icon for Disabled Steps */}
              {isLocked && (
                <div className="stepper-lock" aria-hidden="true">
                  <span>🔒</span>
                </div>
              )}

              {/* Progress Connector */}
              {idx < tabs.length - 1 && (
                <div className="stepper-connector" aria-hidden="true">
                  <div className={`connector-line ${isCompleted ? 'completed' : ''}`}></div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Progress Bar */}
      <div className="nav-progress">
        <div className="progress-info">
          <span className="progress-text">Overall Progress</span>
          <span className="progress-percentage">
            {Math.round((tabs.filter(tab => tab.completed).length / tabs.length) * 100)}%
          </span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ 
              width: `${(tabs.filter(tab => tab.completed).length / tabs.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
