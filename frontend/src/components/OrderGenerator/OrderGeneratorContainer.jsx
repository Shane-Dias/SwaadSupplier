// src/components/OrderGenerator/OrderGeneratorContainer.jsx
import React, { useState, useEffect, useRef } from 'react';
import TabNavigation from './TabNavigation';
import OrderGeneratorForm from './OrderGeneratorForm';
import EstimatedMaterialsList from './EstimatedMaterialsList';
import SupplierList from './SupplierList';
import OrderCart from './OrderCart';
import ProgressSummary from './ProgressSummary';
import './OrderGenerator.css';

export default function OrderGeneratorContainer() {
  const [orderData, setOrderData] = useState(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState({});
  const [suppliersData, setSuppliersData] = useState({});
  const [activeTab, setActiveTab] = useState('generate');
  const sidebarRef = useRef(null);

  // Auto-adjust sidebar content based on available space
  useEffect(() => {
    const adjustSidebarContent = () => {
      if (sidebarRef.current) {
        const sidebar = sidebarRef.current;
        const availableHeight = sidebar.clientHeight;
        const contentHeight = sidebar.scrollHeight;
        
        // If content is less than available space, add more padding to sections
        if (contentHeight < availableHeight) {
          sidebar.style.justifyContent = 'space-between';
        } else {
          sidebar.style.justifyContent = 'flex-start';
        }
      }
    };

    adjustSidebarContent();
    window.addEventListener('resize', adjustSidebarContent);
    
    return () => window.removeEventListener('resize', adjustSidebarContent);
  }, [orderData, selectedSuppliers]);

  const handleGenerate = (data) => {
    setOrderData(data);
    setSelectedSuppliers({});
    setSuppliersData({});
    setActiveTab('materials');
  };

  const handleSupplierSelect = (selected, suppliers) => {
    setSelectedSuppliers(selected);
    setSuppliersData(suppliers);
  };

  const calculateTotalCost = () => {
    if (!orderData || !selectedSuppliers || !suppliersData) return 0;
    
    let total = 0;
    Object.entries(orderData.ingredients).forEach(([ingredient, details]) => {
      const supplierId = selectedSuppliers[ingredient];
      const suppliers = suppliersData[ingredient] || [];
      const supplier = suppliers.find(s => s.id === supplierId);
      
      if (supplier) {
        const requiredKg = details.totalQuantity / 1000;
        const requiredLiters = details.unit === 'ml' ? details.totalQuantity / 1000 : 0;
        const requiredQuantity = details.unit === 'ml' ? requiredLiters : requiredKg;
        total += requiredQuantity * supplier.price;
      }
    });
    
    return Math.ceil(total * 100) / 100;
  };

  // Enhanced tabs with descriptions for stepper navigation
  const tabs = [
    {
      id: 'generate',
      label: 'Generate Order',
      icon: '🎯',
      desc: 'Choose dish and quantity',
      disabled: false,
      completed: !!orderData
    },
    {
      id: 'materials',
      label: 'Raw Materials',
      icon: '📦',
      desc: 'AI-calculated ingredients',
      disabled: !orderData,
      completed: !!orderData
    },
    {
      id: 'suppliers',
      label: 'Select Suppliers',
      icon: '🏪',
      desc: 'Pick the best vendors',
      disabled: !orderData,
      completed: Object.keys(selectedSuppliers).length > 0
    },
    {
      id: 'cart',
      label: 'Review & Order',
      icon: '🛒',
      desc: 'Check your cart and confirm',
      disabled: Object.keys(selectedSuppliers).length === 0,
      completed: false
    }
  ];

  const renderMainContent = () => {
    switch (activeTab) {
      case 'generate':
        return <OrderGeneratorForm onGenerate={handleGenerate} />;
      
      case 'materials':
        return orderData ? (
          <EstimatedMaterialsList 
            ingredients={orderData.ingredients}
            dish={orderData.dish}
            quantity={orderData.quantity}
          />
        ) : null;
      
      case 'suppliers':
        return orderData ? (
          <SupplierList 
            ingredients={orderData.ingredients}
            onSupplierSelect={handleSupplierSelect}
          />
        ) : null;
      
      case 'cart':
        return orderData && Object.keys(selectedSuppliers).length > 0 ? (
          <OrderCart 
            ingredients={orderData.ingredients}
            selectedSuppliers={selectedSuppliers}
            suppliersData={suppliersData}
            dish={orderData.dish}
            quantity={orderData.quantity}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  const handleNewOrder = () => {
    setOrderData(null);
    setSelectedSuppliers({});
    setSuppliersData({});
    setActiveTab('generate');
  };

  const handlePreviousTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const handleNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];
      if (!nextTab.disabled) {
        setActiveTab(nextTab.id);
      }
    }
  };

  const isNextDisabled = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      return tabs[currentIndex + 1].disabled;
    }
    return true;
  };

  return (
    <div className="app-layout">
      {/* Top Header */}
      <header className="app-header">
        <div className="brand-section">
          <h1 className="brand-title">
            <span className="brand-icon">🌟</span>
            SwaadSupplier
          </h1>
          <p className="brand-subtitle">AI-Powered Order Generator</p>
        </div>
      </header>

      <div className="main-layout">
        {/* Enhanced Sidebar with Fixed Positioning */}
        <aside className="sidebar" ref={sidebarRef}>
          {/* Progress Section - Compact */}
          {orderData && (
            <ProgressSummary
              orderData={orderData}
              selectedSuppliers={selectedSuppliers}
              totalCost={calculateTotalCost()}
            />
          )}

          {/* Enhanced Navigation with Stepper */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          {/* Quick Actions */}
          <div className="sidebar-actions">
            {orderData && (
              <button
                className="btn btn-outline new-order-btn"
                onClick={handleNewOrder}
                aria-label="Start a new order"
              >
                <span>🆕</span>
                New Order
              </button>
            )}
          </div>

          {/* Help Section */}
          <div className="sidebar-help">
            <h4>💡 Quick Tips</h4>
            <div className="help-tips">
              <div className="tip-item">
                <span className="tip-icon">⚡</span>
                <span className="tip-text">
                  Use our AI to calculate exact ingredients needed
                </span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">💰</span>
                <span className="tip-text">
                  Compare prices from multiple suppliers automatically
                </span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">📱</span>
                <span className="tip-text">
                  Save orders as templates for faster reordering
                </span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🔥</span>
                <span className="tip-text">
                  Get real-time price updates from vendors
                </span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">📊</span>
                <span className="tip-text">
                  Track your order history and analytics
                </span>
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="sidebar-recent">
            <h4>📋 Recent Orders</h4>
            <div className="recent-orders">
              <div className="recent-item">
                <div className="recent-dish">Chole Bhature</div>
                <div className="recent-details">50 plates • ₹2,450</div>
              </div>
              <div className="recent-item">
                <div className="recent-dish">Pav Bhaji</div>
                <div className="recent-details">30 plates • ₹1,890</div>
              </div>
              <div className="recent-item">
                <div className="recent-dish">Samosa</div>
                <div className="recent-details">100 pieces • ₹1,250</div>
              </div>
              <div className="recent-item">
                <div className="recent-dish">Biryani</div>
                <div className="recent-details">25 plates • ₹3,200</div>
              </div>
              <div className="recent-item">
                <div className="recent-dish">Dal Makhani</div>
                <div className="recent-details">40 plates • ₹1,680</div>
              </div>
            </div>
            <button className="view-all-btn">View All Orders</button>
          </div>

          {/* Spacer to push support to bottom */}
          <div className="sidebar-spacer"></div>

          {/* Support Section - Always at bottom */}
          <div className="sidebar-support">
            <div className="support-card">
              <div className="support-header">
                <span className="support-icon">🎧</span>
                <span className="support-title">Need Help?</span>
              </div>
              <p className="support-text">Get instant support from our team</p>
              <button className="support-btn">Contact Support</button>
            </div>
          </div>
        </aside>
        
        {/* Main Content Area */}
        <main className="main-content">
          <div className="content-wrapper">
            {renderMainContent()}
          </div>

          {/* Bottom Navigation for Mobile */}
          <div className="bottom-navigation">
            {activeTab !== 'generate' && (
              <button
                className="btn btn-secondary"
                onClick={handlePreviousTab}
                aria-label="Go to previous step"
              >
                ← Previous
              </button>
            )}

            {activeTab !== 'cart' && activeTab !== 'generate' && (
              <button
                className="btn btn-primary"
                onClick={handleNextTab}
                disabled={isNextDisabled()}
                aria-label="Go to next step"
              >
                Next →
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
