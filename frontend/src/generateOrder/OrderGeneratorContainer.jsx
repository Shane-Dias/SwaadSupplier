// src/components/OrderGenerator/OrderGeneratorContainer.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import TabNavigation from './TabNavigation';
import OrderGeneratorForm from './OrderGeneratorForm';
import EstimatedMaterialsList from './EstimatedMaterialsList';
import SupplierList from './SupplierList';
import OrderCart from './OrderCart';
import ProgressSummary from './ProgressSummary';

export default function OrderGeneratorContainer() {
  const [orderData, setOrderData] = useState(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState({});
  const [suppliersData, setSuppliersData] = useState({});
  const [activeTab, setActiveTab] = useState('generate');
  const [init, setInit] = useState(false);
  const [isVisible, setIsVisible] = useState({
    header: false,
    sidebar: false,
    content: false,
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Initialize particles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Staggered animations
  useEffect(() => {
    const timers = [
      setTimeout(() => setIsVisible(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setIsVisible(prev => ({ ...prev, sidebar: true })), 400),
      setTimeout(() => setIsVisible(prev => ({ ...prev, content: true })), 600),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Particles configuration (lighter version for background)
  const particlesOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: ["#f97316", "#fb923c", "#fdba74", "#fed7aa"],
        },
        move: {
          enable: true,
          direction: "top",
          outModes: {
            default: "out",
          },
          random: true,
          speed: 0.2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 2000,
          },
          value: 50,
        },
        opacity: {
          value: { min: 0.1, max: 0.3 },
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.05,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.3,
            sync: false,
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

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

  const fadeClass = (element) =>
    `transition-all duration-1000 transform ${
      isVisible[element]
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10"
    }`;

  return (
    <div className="min-h-screen w-full bg-gray-900 relative overflow-hidden">
      {/* Particles Background */}
      {init && (
        <Particles className="absolute inset-0 z-0" options={particlesOptions} />
      )}

      {/* Gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5" />
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-red-500/5 blur-3xl" />

      {/* Top Header */}
      <header className={`relative z-10 px-4 md:px-6 py-3 md:py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm ${fadeClass('header')}`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              className="md:hidden mr-2 text-white/80 hover:text-white"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-2 md:space-x-3">
              <span className="text-2xl md:text-3xl">🌟</span>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-red-300">
                  SwaadSupplier
                </h1>
                <p className="text-xs md:text-sm text-white/60">AI-Powered Order Generator</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs md:text-sm text-orange-200/80">Live System</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-col md:flex-row min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Enhanced Sidebar */}
        <aside className={`fixed md:relative z-30 md:z-0 w-72 md:w-80 h-full bg-gray-800 md:bg-white/5 backdrop-blur-sm border-r border-white/10 overflow-y-auto transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${fadeClass('sidebar')}`}>
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Close button for mobile */}
            <button 
              className="md:hidden absolute top-3 right-3 text-white/60 hover:text-white"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Progress Section */}
            {orderData && (
              <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-orange-500/20">
                <ProgressSummary
                  orderData={orderData}
                  selectedSuppliers={selectedSuppliers}
                  totalCost={calculateTotalCost()}
                />
              </div>
            )}

            {/* Navigation */}
            <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
              <TabNavigation
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setIsMobileSidebarOpen(false);
                }}
                tabs={tabs}
              />
            </div>

            {/* Quick Actions */}
            {orderData && (
              <div className="space-y-2 md:space-y-3">
                <button
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:from-orange-500/30 hover:to-red-500/30 text-orange-200 font-medium transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                  onClick={handleNewOrder}
                >
                  <span className="mr-2">🆕</span>
                  New Order
                </button>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
              <h4 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3 flex items-center">
                <span className="mr-2">💡</span>
                Quick Tips
              </h4>
              <div className="space-y-2 md:space-y-3">
                {[
                  { icon: '⚡', text: 'Use AI to calculate exact ingredients' },
                  { icon: '💰', text: 'Compare prices automatically' },
                  { icon: '📱', text: 'Save orders as templates' },
                  { icon: '🔥', text: 'Get real-time price updates' },
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2 md:space-x-3 text-xs md:text-sm">
                    <span className="text-orange-400 mt-0.5">{tip.icon}</span>
                    <span className="text-white/70">{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
              <h4 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3 flex items-center">
                <span className="mr-2">📋</span>
                Recent Orders
              </h4>
              <div className="space-y-2 md:space-y-3">
                {[
                  { dish: 'Chole Bhature', details: '50 plates • ₹2,450' },
                  { dish: 'Pav Bhaji', details: '30 plates • ₹1,890' },
                  { dish: 'Samosa', details: '100 pieces • ₹1,250' },
                  { dish: 'Biryani', details: '25 plates • ₹3,200' },
                ].map((order, index) => (
                  <div key={index} className="flex justify-between items-center py-1 md:py-2 px-2 md:px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-xs md:text-sm">
                    <div>
                      <div className="text-white font-medium">{order.dish}</div>
                      <div className="text-white/50">{order.details}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-2 md:mt-3 px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm text-orange-300 hover:text-orange-200 transition-colors">
                View All Orders
              </button>
            </div>

            {/* Support Section */}
            {/* <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-3 md:p-4 border border-orange-500/20">
              <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                <span className="text-xl md:text-2xl">🎧</span>
                <span className="text-white font-semibold text-sm md:text-base">Need Help?</span>
              </div>
              <p className="text-white/70 text-xs md:text-sm mb-2 md:mb-3">Get instant support from our team</p>
              <button className="w-full px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium transition-all duration-300 transform hover:scale-105 text-sm md:text-base">
                Contact Support
              </button>
            </div> */}
          </div>
        </aside>
        
        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto ${fadeClass('content')}`}>
          <div className="p-4 md:p-6 max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 min-h-[500px] md:min-h-[600px]">
              {renderMainContent()}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="sticky bottom-0 p-4 md:p-6 bg-gray-900/80 backdrop-blur-sm border-t border-white/10">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
              {activeTab !== 'generate' && (
                <button
                  className="px-4 md:px-6 py-2 md:py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all duration-300 text-sm md:text-base"
                  onClick={handlePreviousTab}
                >
                  ← Previous
                </button>
              )}

              <div className="flex-1" />

              {activeTab !== 'cart' && activeTab !== 'generate' && (
                <button
                  className="px-4 md:px-6 py-2 md:py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm md:text-base"
                  onClick={handleNextTab}
                  disabled={isNextDisabled()}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-gray-900/20 pointer-events-none" />
    </div>
  );
}