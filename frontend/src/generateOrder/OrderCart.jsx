// src/components/OrderGenerator/OrderCart.jsx
import React, { useState, useEffect } from 'react';
import generateInvoice from '../utils/generateInvoice';
import AIBusinessInsights from './AIBusinessInsights';

export default function OrderCart({
  ingredients,
  selectedSuppliers,
  suppliersData,
  dish,
  quantity
}) {
  const [orderQuantities, setOrderQuantities] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const [isVisible, setIsVisible] = useState({
    header: false,
    summary: false,
    items: false,
    breakdown: false,
    delivery: false,
    actions: false,
    invoice: false,
  });

  // Staggered animations
  useEffect(() => {
    const timers = [
      setTimeout(() => setIsVisible(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setIsVisible(prev => ({ ...prev, summary: true })), 400),
      setTimeout(() => setIsVisible(prev => ({ ...prev, items: true })), 600),
      setTimeout(() => setIsVisible(prev => ({ ...prev, breakdown: true })), 800),
      setTimeout(() => setIsVisible(prev => ({ ...prev, delivery: true })), 1000),
      setTimeout(() => setIsVisible(prev => ({ ...prev, actions: true })), 1200),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Initialize order quantities based on required amounts
  useEffect(() => {
    const initialQuantities = {};
    Object.entries(ingredients).forEach(([ingredient, details]) => {
      const supplierId = selectedSuppliers[ingredient];
      if (supplierId) {
        const requiredKg = details.totalQuantity / 1000;
        const requiredLiters = details.unit === 'ml' ? details.totalQuantity / 1000 : 0;
        const requiredQuantity = details.unit === 'ml' ? requiredLiters : requiredKg;
        initialQuantities[ingredient] = Math.ceil(requiredQuantity);
      }
    });
    setOrderQuantities(initialQuantities);
  }, [ingredients, selectedSuppliers]);

  // Calculate total cost whenever quantities change
  useEffect(() => {
    let total = 0;
    Object.entries(orderQuantities).forEach(([ingredient, orderQuantity]) => {
      const supplierId = selectedSuppliers[ingredient];
      const suppliers = suppliersData[ingredient] || [];
      const supplier = suppliers.find(s => s.id === supplierId);

      if (supplier && orderQuantity) {
        total += orderQuantity * supplier.price;
      }
    });
    setTotalCost(total);
  }, [orderQuantities, selectedSuppliers, suppliersData]);

  const handleQuantityChange = (ingredient, newQuantity) => {
    setOrderQuantities(prev => ({
      ...prev,
      [ingredient]: Math.max(0, parseInt(newQuantity) || 0)
    }));
  };

  const handlePlaceOrder = () => {
    const orderDetails = {
      dish,
      quantity,
      ingredients: Object.entries(orderQuantities).map(([ingredient, orderQuantity]) => {
        const supplierId = selectedSuppliers[ingredient];
        const suppliers = suppliersData[ingredient] || [];
        const supplier = suppliers.find(s => s.id === supplierId);
        const details = ingredients[ingredient];

        return {
          ingredient,
          supplier: supplier?.name || 'Unknown',
          supplierId,
          orderQuantity,
          pricePerUnit: supplier?.price || 0,
          totalPrice: orderQuantity * (supplier?.price || 0),
          requiredQuantity: details.totalQuantity,
          unit: details.unit
        };
      }),
      totalCost,
      orderDate: new Date().toISOString()
    };

    const finalDetails = {
      ...orderDetails,
      _id: `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
      status: 'Placed',
      vendor: { shopName: 'Vendor Kitchen', location: 'Mumbai', contact: '+91 98765 43210' },
      supplier: { shopName: 'Swaad Network', location: 'Summary' },
      items: orderDetails.ingredients.map(ing => ({
        item: {
          name: ing.ingredient.charAt(0).toUpperCase() + ing.ingredient.slice(1),
          category: 'Raw Material',
          unitType: ing.unit === 'ml' ? 'L' : 'kg',
          pricePerUnit: ing.pricePerUnit
        },
        quantity: ing.orderQuantity,
        supplierName: ing.supplier
      })),
      totalAmount: Math.round(totalCost * 1.05 + 50),
      subtotal: totalCost,
      tax: Math.round(totalCost * 0.05),
      deliveryFee: 50
    };

    setPlacedOrderDetails(finalDetails);
    setIsOrderPlaced(true);
    setTimeout(() => setIsVisible(prev => ({ ...prev, invoice: true })), 100);
  };

  const handleDownloadInvoice = () => {
    if (placedOrderDetails) {
      generateInvoice(placedOrderDetails);
    }
  };

  const fadeClass = (element) =>
    `transition-all duration-1000 transform ${isVisible[element]
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-10"
    }`;

  if (!ingredients || Object.keys(selectedSuppliers).length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold text-white">No Suppliers Selected</h3>
          <p className="text-white/60">Please select suppliers first to review your cart</p>
        </div>
      </div>
    );
  }

  // Invoice View
  if (isOrderPlaced && placedOrderDetails) {
    return (
      <div className={`p-8 max-w-4xl mx-auto ${fadeClass('invoice')}`}>
        <div className="bg-white/95 text-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-500 font-bold text-xl">✓</div>
                <h2 className="text-3xl font-bold">Order Confirmed!</h2>
              </div>
              <p className="opacity-90">Thank you for your order. Here is your receipt.</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-mono opacity-80">INVOICE</h3>
              <p className="font-mono text-lg font-bold">#{placedOrderDetails._id}</p>
              <p className="text-sm opacity-75">{new Date(placedOrderDetails.orderDate).toLocaleString()}</p>
            </div>
          </div>

          {/* Invoice Body */}
          <div className="p-8">
            {/* Bill To / From */}
            <div className="flex justify-between mb-8 pb-8 border-b border-gray-200">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Billed To</h4>
                <p className="font-bold text-lg">{placedOrderDetails.vendor.shopName}</p>
                <p className="text-gray-500">{placedOrderDetails.vendor.location}</p>
                <p className="text-gray-500">{placedOrderDetails.vendor.contact}</p>
              </div>
              <div className="text-right">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Supplier Network</h4>
                <p className="font-bold text-lg">SwaadSupplier Platform</p>
                <p className="text-gray-500">Aggregated Suppliers</p>
                <p className="text-gray-500">Mumbai, India</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {placedOrderDetails.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{item.item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.supplierName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{item.quantity} {item.item.unitType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">₹{item.item.pricePerUnit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium">₹{(item.quantity * item.item.pricePerUnit).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{placedOrderDetails.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{placedOrderDetails.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>₹{placedOrderDetails.tax}</span>
                </div>
                <div className="pt-3 border-t-2 border-orange-500 flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-800">Total</span>
                  <span className="font-bold text-2xl text-orange-600">₹{placedOrderDetails.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-200">
            <button
              onClick={() => window.location.reload()}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              ← Start New Order
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <span>📄</span>
              <span>Download Invoice PDF</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const finalTotal = Math.round(totalCost * 1.05 + 50);

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className={`text-center space-y-4 ${fadeClass('header')}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-sm text-orange-200/80 tracking-wide font-medium">
            🛒 Final Review
          </span>
        </div>

        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-red-300">
          Review & Order
        </h3>
        <p className="text-white/60 text-lg">
          Review your cart and confirm your order
        </p>
      </div>

      {/* ⚠️ Missing Items Warning */}
      {Object.keys(ingredients).length > Object.keys(selectedSuppliers).length && (
        <div className={`${fadeClass('header')}`}>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-yellow-300 mb-2">Partial Order Detected</h4>
                <p className="text-yellow-100/80 mb-4">
                  You have selected suppliers for only <span className="font-bold text-white">{Object.keys(selectedSuppliers).length}</span> out of <span className="font-bold text-white">{Object.keys(ingredients).length}</span> ingredients.
                  The total cost (₹{Math.round(totalCost * 1.05 + 50).toLocaleString()}) looks low because it only includes the selected items.
                </p>

                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-sm text-yellow-200/60 mb-2 uppercase font-bold tracking-wider">Missing Items:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(ingredients)
                      .filter(ing => !selectedSuppliers[ing])
                      .map(ing => (
                        <span key={ing} className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-200 text-sm border border-yellow-500/10">
                          {ing.charAt(0).toUpperCase() + ing.slice(1)}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary Header */}
      <div className={`${fadeClass('summary')}`}>
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
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

            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-300">{Object.keys(ingredients).length}</div>
                <div className="text-white/60 text-sm">ingredients</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-300">{Object.keys(selectedSuppliers).length}</div>
                <div className="text-white/60 text-sm">suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
                  ₹{totalCost.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm">subtotal</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 AI Business Insights Dashboard */}
      <div className={`mb-8 ${fadeClass('summary')}`}>
        <AIBusinessInsights
          ingredients={ingredients}
          totalCost={totalCost}
          dish={dish}
          quantity={quantity}
          selectedSuppliers={selectedSuppliers}
          suppliersData={suppliersData}
        />
      </div>

      {/* Cart Items */}
      <div className={`space-y-6 ${fadeClass('items')}`}>
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-bold text-white flex items-center space-x-2">
            <span>📋</span>
            <span>Order Items</span>
          </h4>
          <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-medium">
            {Object.keys(selectedSuppliers).length} items
          </span>
        </div>

        <div className="space-y-4">
          {Object.entries(selectedSuppliers).map(([ingredient, supplierId], index) => {
            const suppliers = suppliersData[ingredient] || [];
            const supplier = suppliers.find(s => s.id === supplierId);
            const details = ingredients[ingredient];
            const orderQuantity = orderQuantities[ingredient] || 0;
            const itemTotal = orderQuantity * (supplier?.price || 0);

            const requiredKg = details.totalQuantity / 1000;
            const requiredLiters = details.unit === 'ml' ? details.totalQuantity / 1000 : 0;
            const requiredQuantity = details.unit === 'ml' ? requiredLiters : requiredKg;
            const unit = details.unit === 'ml' ? 'L' : 'kg';

            return (
              <div
                key={ingredient}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🥘</span>
                        <div>
                          <h5 className="text-lg font-semibold text-white">
                            {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                          </h5>
                          <div className="flex items-center space-x-2 text-sm text-white/60">
                            <span>Supplier:</span>
                            <span className="text-white font-medium">{supplier?.name || 'Unknown'}</span>
                            <span className="text-yellow-400">⭐ {supplier?.rating || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-orange-300">
                        ₹{itemTotal.toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-white/60 text-sm mb-2">Required Quantity</div>
                        <div className="text-lg font-bold text-white">
                          {requiredQuantity.toFixed(2)} {unit}
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-white/60 text-sm mb-2">Order Quantity</div>
                        <div className="flex items-center space-x-2">
                          <button
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors disabled:opacity-50"
                            onClick={() => handleQuantityChange(ingredient, orderQuantity - 1)}
                            disabled={orderQuantity <= 1}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={orderQuantity}
                            onChange={(e) => handleQuantityChange(ingredient, e.target.value)}
                            className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                            min="0"
                          />
                          <button
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                            onClick={() => handleQuantityChange(ingredient, orderQuantity + 1)}
                          >
                            +
                          </button>
                          <span className="text-white/60 text-sm">{unit}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="text-white/70">
                        ₹{supplier?.price || 0}/{unit}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-300">{supplier?.availability || 'In Stock'}</span>
                      </div>
                    </div>

                    {orderQuantity < requiredQuantity && (
                      <div className="flex items-center space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <span className="text-yellow-400">⚠️</span>
                        <span className="text-yellow-200 text-sm">
                          Ordering less than required quantity. You may need additional {ingredient}.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary Breakdown */}
      <div className={`${fadeClass('breakdown')}`}>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h4 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <span>💰</span>
            <span>Order Summary</span>
          </h4>

          <div className="space-y-4">
            {Object.entries(selectedSuppliers).map(([ingredient, supplierId]) => {
              const suppliers = suppliersData[ingredient] || [];
              const supplier = suppliers.find(s => s.id === supplierId);
              const orderQuantity = orderQuantities[ingredient] || 0;
              const itemTotal = orderQuantity * (supplier?.price || 0);
              const unit = ingredients[ingredient].unit === 'ml' ? 'L' : 'kg';

              return (
                <div key={ingredient} className="flex justify-between items-center py-2">
                  <div className="text-white">
                    {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                    <span className="text-white/60 ml-2">({orderQuantity} {unit})</span>
                  </div>
                  <div className="text-orange-300 font-semibold">₹{itemTotal.toLocaleString()}</div>
                </div>
              );
            })}

            <div className="border-t border-white/20 pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Subtotal:</span>
                <span className="text-white font-semibold">₹{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Delivery Fee:</span>
                <span className="text-white font-semibold">₹50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Tax (5%):</span>
                <span className="text-white font-semibold">₹{Math.round(totalCost * 0.05).toLocaleString()}</span>
              </div>
              <div className="border-t border-white/20 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">Total Amount:</span>
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className={`${fadeClass('delivery')}`}>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h4 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <span>🚚</span>
            <span>Delivery Information</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-2xl">
                📅
              </div>
              <div>
                <div className="text-white/60 text-sm">Estimated Delivery</div>
                <div className="text-white font-semibold">Tomorrow, 10:00 AM - 2:00 PM</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-2xl">
                📍
              </div>
              <div>
                <div className="text-white/60 text-sm">Delivery Address</div>
                <div className="text-white font-semibold">Restaurant Kitchen, Main Branch</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-2xl">
                📞
              </div>
              <div>
                <div className="text-white/60 text-sm">Contact</div>
                <div className="text-white font-semibold">+91 98765 43210</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex flex-col sm:flex-row gap-4 justify-center ${fadeClass('actions')}`}>
        <button className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
          <span>💾</span>
          <span>Save as Template</span>
        </button>

        <button
          onClick={handlePlaceOrder}
          disabled={totalCost === 0}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <span>🚀</span>
          <span>Place Order - ₹{finalTotal.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
}
