import React, { useState, useEffect } from "react";
import { Package, Clock, Truck, CheckCircle, AlertCircle } from "lucide-react";

const SupplierOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Your provided fetch function
  const fetchSupplierOrders = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/supplier`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      console.log("Supplier Orders:", data);
      return data;
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      return [];
    }
  };

  // Your provided update function
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/supplier/update-status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      console.log("Status updated:", data);
      return data;
    } catch (error) {
      console.error("Error updating status:", error.message);
      throw error;
    }
  };

  // Load orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const data = await fetchSupplierOrders();
      setOrders(data);
      setLoading(false);
    };

    loadOrders();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      alert("Failed to update order status: " + error.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Get status icon and color
  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          color: "text-orange-400",
          bgColor: "bg-orange-400/10",
          label: "Ordered",
        };
      case "packed":
        return {
          icon: Package,
          color: "text-purple-400",
          bgColor: "bg-purple-400/10",
          label: "Packed",
        };
      case "shipped":
        return {
          icon: Truck,
          color: "text-blue-400",
          bgColor: "bg-blue-400/10",
          label: "Shipped",
        };
      case "out_for_delivery":
        return {
          icon: Truck,
          color: "text-indigo-400",
          bgColor: "bg-indigo-400/10",
          label: "Out for Delivery",
        };
      case "delivered":
        return {
          icon: CheckCircle,
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          label: "Delivered",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-gray-400",
          bgColor: "bg-gray-400/10",
          label: status,
        };
    }
  };

  const getNextStatusAction = (status) => {
    switch (status) {
      case "pending":
        return { label: "Accept & Pack", next: "packed" };
      case "packed":
        return { label: "Ship Order", next: "shipped" };
      case "shipped":
        return { label: "Out for Delivery", next: "out_for_delivery" };
      case "out_for_delivery":
        return { label: "Mark Delivered", next: "delivered" };
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
            Supplier Orders
          </h1>
          <p className="text-gray-400">
            Manage your incoming orders from vendors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {["pending", "shipped", "delivered"].map((status) => {
            const count = orders.filter(
              (order) => order.status === status
            ).length;
            const config = getStatusConfig(status);
            const Icon = config.icon;

            return (
              <div
                key={status}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wide">
                      {config.label}
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {count}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${config.bgColor}`}>
                    <Icon className={`h-6 w-6 ${config.color}`} />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {orders.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-orange-400/10 to-red-500/10">
                <Package className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 text-center border border-gray-700/50">
              <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No Orders Found
              </h3>
            </div>
          ) : (
            orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order._id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-orange-400/30 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-white">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bgColor}`}
                        >
                          <StatusIcon
                            className={`h-4 w-4 ${statusConfig.color}`}
                          />
                          <span
                            className={`text-sm font-medium ${statusConfig.color}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Vendor ID</p>
                          <p className="text-gray-300 font-mono">
                            {order.vendor.shopName}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Total Amount</p>
                          <p className="text-green-400 font-semibold">
                            ${order.totalAmount}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Order Date</p>
                          <p className="text-gray-300">
                            {formatDate(order.orderedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-gray-400 text-sm">
                          Items ({order.items?.length || 0})
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-300 text-sm">
                            {order.items?.length || 0} item(s) in this order
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Update Buttons */}
                    <div className="flex flex-wrap gap-2 lg:flex-col lg:w-48">
                      {(() => {
                        const nextAction = getNextStatusAction(order.status);
                        const isUpdating = updatingStatus === order._id;

                        if (!nextAction) return (
                          <div className="text-center p-2 rounded-lg bg-green-500/10 text-green-400 text-sm font-bold border border-green-500/20">
                            Completed
                          </div>
                        );

                        return (
                          <button
                            onClick={() => handleStatusUpdate(order._id, nextAction.next)}
                            disabled={isUpdating}
                            className={`px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 flex-1 lg:flex-none bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] ${isUpdating ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                          >
                            {isUpdating ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                Updating...
                              </div>
                            ) : (
                              nextAction.label
                            )}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierOrdersPage;
