import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function VendorOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Status colors mapping
  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  // Fetch orders for current vendor
  const fetchVendorOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiUrl}/api/orders/vendor`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel order function
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiUrl}/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      // Update local state to reflect cancellation
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
      
      alert('Order cancelled successfully');
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchVendorOrders();
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Loading Your Orders...
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
              Error Loading Orders
            </div>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={fetchVendorOrders}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-900 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            Your Orders
          </h2>
          <p className="text-gray-400">View and manage your order history</p>
          <button
            onClick={fetchVendorOrders}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-orange-400 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 shadow-[3px_3px_6px_rgba(0,0,0,0.25),-2px_-2px_5px_rgba(70,70,70,0.05)]"
          >
            🔄 Refresh Orders
          </button>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 gap-6 pb-8">
          {orders.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 text-center shadow-[5px_5px_15px_rgba(0,0,0,0.4),-5px_-5px_15px_rgba(70,70,70,0.1)]">
              <div className="text-4xl mb-4">📦</div>
              <p className="text-gray-400">No orders found</p>
              <p className="text-gray-500 text-sm mt-2">
                You haven't placed any orders yet
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300 shadow-[5px_5px_15px_rgba(0,0,0,0.4),-5px_-5px_15px_rgba(70,70,70,0.1)]"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Placed on {formatDate(order.orderedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Supplier Info */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-white mb-2">Supplier</h4>
                  <div className="space-y-2">
                    <p className="text-yellow-400 font-bold text-lg">{order.supplier.shopName}</p>
                    <p className="text-gray-400 text-sm">{order.supplier.location}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-2">
                  <h4 className="font-medium text-white mb-3">Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div 
                        key={item.item._id} 
                        className="flex justify-between items-center bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:bg-gray-700/50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {item.item.category === 'vegetables' ? '🥬' : 
                             item.item.category === 'fruits' ? '🍎' : 
                             item.item.category === 'dairy' ? '🥛' : 
                             item.item.category === 'spice' ? '🌶️' : 
                             item.item.category === 'oil' ? '🫒' : 
                             item.item.category === 'grain' ? '🌾' : '📦'}
                          </span>
                          <div>
                            <p className="text-white capitalize">{item.item.name}</p>
                            <p className="text-gray-400 text-xs capitalize">
                              {item.item.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white">
                            {item.quantity} {item.item.unitType} × ₹{item.item.pricePerUnit}
                          </p>
                          <p className="text-blue-300 font-medium">
                            ₹{(item.quantity * item.item.pricePerUnit).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                {order.status === 'pending' && (
                  <div className="mt-6 flex justify-end gap-3">
                    <button 
                      className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-all duration-300 shadow-[3px_3px_6px_rgba(0,0,0,0.25),-2px_-2px_5px_rgba(70,70,70,0.05)]"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}