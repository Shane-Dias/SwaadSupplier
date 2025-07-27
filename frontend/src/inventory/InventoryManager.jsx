// src/components/Inventory/InventoryManager.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemsInventory from './ItemsInventory';

export default function InventoryManager() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('inventory');

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    if (section === 'generator') {
      navigate('/orders');
    } else {
      navigate('/orders/inventory');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Section Selector Dropdown */}
      <div className="bg-gray-800 border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="order-1 md:order-none">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Orders Management</h1>
              <p className="text-white/60 mt-1 md:mt-2 text-sm md:text-base">
                Manage your orders and inventory efficiently
              </p>
            </div>
            
            <div className="relative w-full md:w-auto order-0 md:order-none">
              <select
                value={currentSection}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="w-full md:w-auto appearance-none bg-white/10 border border-white/20 rounded-xl px-4 md:px-6 py-2 md:py-3 pr-10 md:pr-12 text-white font-medium cursor-pointer hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm md:text-base"
                style={{ colorScheme: 'dark' }}
              >
                <option value="generator" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>
                  🤖 AI Order Generator
                </option>
                <option value="inventory" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>
                  📦 Items Inventory
                </option>
              </select>
              
              <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-white/60">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 md:p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/70 text-xs md:text-sm">
              📦 Select items manually and set custom quantities for your order without AI assistance
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ItemsInventory />
    </div>
  );
}