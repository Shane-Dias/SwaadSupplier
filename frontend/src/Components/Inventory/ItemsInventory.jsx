// src/components/Inventory/ItemsInventory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function ItemsInventory() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Available categories
  const categories = [
    { value: 'vegetable', label: 'Vegetables', icon: '🥬' },
    { value: 'spice', label: 'Spices', icon: '🌶️' },
    { value: 'oil', label: 'Oils', icon: '🫒' },
    { value: 'grain', label: 'Grains', icon: '🌾' },
    { value: 'dairy', label: 'Dairy', icon: '🥛' },
    { value: 'protein', label: 'Proteins', icon: '🍖' },
    { value: 'condiment', label: 'Condiments', icon: '🧂' },
    { value: 'herb', label: 'Herbs', icon: '🌿' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];

  // Fetch available items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // In a real app, you would fetch from your API:
        // const response = await fetch(`${apiUrl}/api/items`);
        // const data = await response.json();
        // setItems(data);
        
        // Mock data for demonstration
        const mockItems = [
          {
            id: '688532e1e7f6a2679fe3de4d',
            name: 'Fresh Onions',
            category: 'vegetable',
            availableStock: 100,
            selectedQuantity: 0,
            unit: 'kg',
            pricePerUnit: 30,
            supplier: 'Fresh Vegetables Co.',
            supplierId: '65a1b2c3d4e5f6g7h8i9j2',
            location: 'Mumbai'
          },
          {
            id: '688532e1e7f6a2679fe3de4e',
            name: 'Ripe Tomatoes',
            category: 'vegetable',
            availableStock: 80,
            selectedQuantity: 0,
            unit: 'kg',
            pricePerUnit: 40,
            supplier: 'Garden Fresh Suppliers',
            supplierId: '65a1b2c3d4e5f6g7h8i9j4',
            location: 'Delhi'
          },
          {
            id: '688532e1e7f6a2679fe3de4f',
            name: 'Basmati Rice',
            category: 'grain',
            availableStock: 200,
            selectedQuantity: 0,
            unit: 'kg',
            pricePerUnit: 80,
            supplier: 'Premium Grains Ltd.',
            supplierId: '65a1b2c3d4e5f6g7h8i9j6',
            location: 'Punjab'
          },
          {
            id: '688532e1e7f6a2679fe3de4g',
            name: 'Turmeric Powder',
            category: 'spice',
            availableStock: 50,
            selectedQuantity: 0,
            unit: 'kg',
            pricePerUnit: 120,
            supplier: 'Spice Kingdom',
            supplierId: '65a1b2c3d4e5f6g7h8i9j8',
            location: 'Kerala'
          },
          {
            id: '688532e1e7f6a2679fe3de4h',
            name: 'Cooking Oil',
            category: 'oil',
            availableStock: 100,
            selectedQuantity: 0,
            unit: 'l',
            pricePerUnit: 150,
            supplier: 'Pure Oils Ltd.',
            supplierId: '65a1b2c3d4e5f6g7h8i9j0',
            location: 'Rajasthan'
          },
          {
            id: '688532e1e7f6a2679fe3de4i',
            name: 'Fresh Milk',
            category: 'dairy',
            availableStock: 200,
            selectedQuantity: 0,
            unit: 'l',
            pricePerUnit: 60,
            supplier: 'Dairy Fresh Co.',
            supplierId: '65a1b2c3d4e5f6g7h8i9k2',
            location: 'Haryana'
          }
        ];
        setItems(mockItems);
        
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle quantity selection for items
  const handleQuantityChange = (itemId, quantity) => {
    const numQuantity = parseFloat(quantity) || 0;
    const item = items.find(i => i.id === itemId);
    
    if (numQuantity > item.availableStock) {
      alert(`Maximum available stock is ${item.availableStock} ${item.unit}`);
      return;
    }

    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, selectedQuantity: numQuantity }
        : item
    ));

    // Update cart
    const updatedCart = [...cart];
    const cartItemIndex = updatedCart.findIndex(cartItem => cartItem.id === itemId);
    
    if (numQuantity === 0) {
      // Remove from cart if quantity is 0
      if (cartItemIndex > -1) {
        updatedCart.splice(cartItemIndex, 1);
      }
    } else {
      const updatedItem = { ...item, selectedQuantity: numQuantity };
      if (cartItemIndex > -1) {
        updatedCart[cartItemIndex] = updatedItem;
      } else {
        updatedCart.push(updatedItem);
      }
    }
    
    setCart(updatedCart);
  };

  // Add item to selection
  const handleAddToCart = (item) => {
    if (item.selectedQuantity <= 0) {
      alert('Please select a quantity first');
      return;
    }

    const existingCartItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingCartItem) {
      alert('Item already in cart. Update quantity if needed.');
      return;
    }

    setCart([...cart, { ...item }]);
    alert(`${item.name} added to cart!`);
  };

  // Remove item from cart
  const handleRemoveFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, selectedQuantity: 0 }
        : item
    ));
  };

  // Calculate total cost
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.selectedQuantity * item.pricePerUnit);
    }, 0);
  };

  const getCategoryIcon = (category) => {
    return categories.find(cat => cat.value === category)?.icon || '📦';
  };

  const selectedItems = items.filter(item => item.selectedQuantity > 0);

  // Handle order placement
const handlePlaceOrder = async () => {
  if (cart.length === 0) {
    alert('Please add items to cart first');
    return;
  }

  setIsPlacingOrder(true);

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found - please login again');
    }

    // Verify all items come from the same supplier
    const firstSupplier = cart[0].supplierId;
    const mixedSuppliers = cart.some(item => item.supplierId !== firstSupplier);
    
    if (mixedSuppliers) {
      throw new Error('All items in cart must be from the same supplier');
    }

    const orderData = {
      supplierName: cart[0].supplier, // Using supplier name from first item
      items: cart.map(item => ({
        item: item.id,
        quantity: item.selectedQuantity
      })),
      totalAmount: calculateTotal()
    };

    const response = await fetch(`${apiUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error messages from backend
      if (data.message === 'Supplier not found') {
        throw new Error(`Supplier "${orderData.supplierName}" not found. Please verify the name.`);
      }
      throw new Error(data.message || 'Failed to place order');
    }

    // Success - show confirmation and clear cart
    alert(`Order placed successfully! Total: ₹${calculateTotal().toLocaleString()}`);
    
    // Reset quantities in items list
    setItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        selectedQuantity: 0
      }))
    );
    
    setCart([]); // Clear cart
    
    // Redirect to orders history
    navigate('/orders/history');

  } catch (error) {
    console.error('Order placement error:', error);
    
    // User-friendly error messages
    let errorMessage = error.message;
    
    if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Network error - please check your connection';
    } else if (error.message.includes('Unexpected token')) {
      errorMessage = 'Invalid server response';
    }
    
    alert(`Error: ${errorMessage}`);
    
    // Optionally refresh token if unauthorized
    if (error.message.includes('Unauthorized') || error.message.includes('token')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  } finally {
    setIsPlacingOrder(false);
  }
};

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Raw Materials Inventory</h2>
          <p className="text-white/60">Select items and set quantities manually for your order</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Search Items</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                style={{ colorScheme: 'dark' }}
              >
                <option value="all" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>
                  All Categories
                </option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value} style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-300">{items.length}</div>
            <div className="text-white/60 text-sm mt-1">Available Items</div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-300">{selectedItems.length}</div>
            <div className="text-white/60 text-sm mt-1">Selected Items</div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-300">{cart.length}</div>
            <div className="text-white/60 text-sm mt-1">In Cart</div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-300">₹{calculateTotal().toLocaleString()}</div>
            <div className="text-white/60 text-sm mt-1">Total Cost</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Items */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-6">Available Items</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                      <div>
                        <h4 className="font-semibold text-white">{item.name}</h4>
                        <span className="text-xs text-white/50 capitalize">{item.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Available:</span>
                      <span className="text-white font-bold">{item.availableStock} {item.unit}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Price:</span>
                      <span className="text-blue-300 font-bold">₹{item.pricePerUnit}/{item.unit}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Supplier:</span>
                      <span className="text-white text-xs">{item.supplier}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="space-y-2">
                      <label className="block text-white/60 text-sm">Select Quantity:</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max={item.availableStock}
                          step="0.1"
                          value={item.selectedQuantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-center focus:outline-none focus:border-blue-500/50"
                        />
                        <span className="text-white/60 font-medium">{item.unit}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {item.selectedQuantity > 0 && !cart.find(cartItem => cartItem.id === item.id) && (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all duration-300"
                      >
                        Add to Cart
                      </button>
                    )}

                    {cart.find(cartItem => cartItem.id === item.id) && (
                      <div className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30">
                        <span className="text-green-300 text-sm">✓ Added to Cart</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-2xl font-bold text-white mb-6">Your Cart</h3>
              
              {cart.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-white/60">No items in cart yet</p>
                  <p className="text-white/40 text-sm mt-2">Select items and quantities to add them</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getCategoryIcon(item.category)}</span>
                          <div>
                            <h4 className="text-white font-medium text-sm">{item.name}</h4>
                            <span className="text-white/50 text-xs">{item.supplier}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Quantity:</span>
                          <span className="text-white">{item.selectedQuantity} {item.unit}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Unit Price:</span>
                          <span className="text-blue-300">₹{item.pricePerUnit}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-white/10 pt-2">
                          <span className="text-white font-medium">Total:</span>
                          <span className="text-green-300 font-bold">₹{(item.selectedQuantity * item.pricePerUnit).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Cart Total */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-white">Grand Total:</span>
                      <span className="text-2xl font-bold text-blue-300">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    
                    <button 
                      className={`w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${isPlacingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                    >
                      {isPlacingOrder ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Placing Order...
                        </>
                      ) : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}