// src/components/OrderGenerator/SupplierList.jsx
import React, { useState, useEffect } from 'react';
import { getSuppliersByIngredient } from '../utils/supplierData';

export default function SupplierList({ ingredients, onSupplierSelect }) {
  const [selectedSuppliers, setSelectedSuppliers] = useState({});
  const [suppliersData, setSuppliersData] = useState({});
  const [isVisible, setIsVisible] = useState({
    header: false,
    content: false,
  });

  // Staggered animations
  useEffect(() => {
    const timers = [
      setTimeout(() => setIsVisible(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setIsVisible(prev => ({ ...prev, content: true })), 400),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (!ingredients) return;

    const newSuppliersData = {};
    const newSelectedSuppliers = {};

    Object.keys(ingredients).forEach(ingredient => {
      const suppliers = getSuppliersByIngredient(ingredient);
      newSuppliersData[ingredient] = suppliers;
      
      // Auto-select best supplier (lowest price)
      if (suppliers.length > 0) {
        const bestSupplier = suppliers.sort((a, b) => a.price - b.price)[0];
        newSelectedSuppliers[ingredient] = bestSupplier.id;
      }
    });

    setSuppliersData(newSuppliersData);
    setSelectedSuppliers(newSelectedSuppliers);
    onSupplierSelect(newSelectedSuppliers, newSuppliersData);
  }, [ingredients, onSupplierSelect]);

  const handleSupplierChange = (ingredient, supplierId) => {
    const newSelected = {
      ...selectedSuppliers,
      [ingredient]: parseInt(supplierId)
    };
    setSelectedSuppliers(newSelected);
    onSupplierSelect(newSelected, suppliersData);
  };

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
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-2xl font-bold text-white">No Ingredients Available</h3>
          <p className="text-white/60">Please generate an order first to see supplier options</p>
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
            🏪 Smart Supplier Selection
          </span>
        </div>
        
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-red-300">
          Select Suppliers
        </h3>
        <p className="text-white/60 text-lg">
          Choose the best suppliers for each ingredient based on price, quality, and availability
        </p>
      </div>

      {/* Suppliers Container */}
      <div className={`space-y-8 ${fadeClass('content')}`}>
        {Object.entries(ingredients).map(([ingredient, details], index) => {
          const suppliers = suppliersData[ingredient] || [];
          
          return (
            <div 
              key={ingredient} 
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Ingredient Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                    <span className="text-xl">🥘</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {ingredient.toUpperCase()}
                    </h4>
                    <p className="text-white/60 text-sm">Required for your order</p>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30">
                  <span className="text-orange-300 font-bold">
                    {details.totalQuantity} {details.unit}
                  </span>
                </div>
              </div>
              
              {suppliers.length === 0 ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">⚠️</div>
                  <div className="text-yellow-200 font-semibold mb-2">No Suppliers Available</div>
                  <div className="text-yellow-200/80 text-sm">
                    This ingredient is currently not available from our suppliers
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Best Choice Indicator */}
                  {suppliers.length > 1 && (
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-green-400">💡</span>
                      <span className="text-green-300 text-sm font-medium">
                        Best choice auto-selected based on price and rating
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliers.map((supplier, supplierIndex) => {
                      const isSelected = selectedSuppliers[ingredient] === supplier.id;
                      const isBest = supplier.id === suppliers.sort((a, b) => a.price - b.price)[0]?.id;
                      
                      return (
                        <label 
                          key={supplier.id} 
                          className={`relative cursor-pointer block transition-all duration-300 transform hover:scale-105 ${
                            isSelected 
                              ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/50 ring-2 ring-orange-500/30' 
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          } border rounded-xl p-4`}
                          style={{ animationDelay: `${supplierIndex * 50}ms` }}
                        >
                          <input 
                            type="radio"
                            name={`supplier-${ingredient}`}
                            value={supplier.id}
                            checked={isSelected}
                            onChange={(e) => handleSupplierChange(ingredient, e.target.value)}
                            className="sr-only"
                          />
                          
                          {/* Best Choice Badge */}
                          {isBest && (
                            <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white shadow-lg">
                              Best
                            </div>
                          )}

                          {/* Selected Indicator */}
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                          )}
                          
                          <div className="space-y-3">
                            {/* Supplier Header */}
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-white text-lg">
                                {supplier.name}
                              </h5>
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-400">⭐</span>
                                <span className="text-white font-semibold">{supplier.rating}</span>
                              </div>
                            </div>
                            
                            {/* Supplier Metrics */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">Price:</span>
                                <span className="text-orange-300 font-bold">
                                  ₹{supplier.price}/{supplier.unit}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">Distance:</span>
                                <div className="flex items-center space-x-1">
                                  <span className="text-blue-400">📍</span>
                                  <span className="text-white">{supplier.distance}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">Stock:</span>
                                <div className="flex items-center space-x-1">
                                  <span className="text-green-400">📦</span>
                                  <span className="text-white">{supplier.stock} {supplier.unit}</span>
                                </div>
                              </div>

                              {/* Availability Status */}
                              <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">Status:</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                  <span className="text-green-300 text-sm font-medium">Available</span>
                                </div>
                              </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="pt-2 border-t border-white/10">
                              <div className="flex justify-between text-xs text-white/50">
                                <span>Delivery: 24hrs</span>
                                <span>Min Order: 1kg</span>
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selection Summary */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <span className="text-white font-bold">
                {Object.keys(selectedSuppliers).length}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Suppliers Selected</h4>
              <p className="text-orange-200/80 text-sm">
                {Object.keys(selectedSuppliers).length} out of {Object.keys(ingredients).length} ingredients covered
              </p>
            </div>
          </div>
          
          {Object.keys(selectedSuppliers).length === Object.keys(ingredients).length && (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
              <span className="text-green-400">✅</span>
              <span className="text-green-300 font-medium">All Set!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
