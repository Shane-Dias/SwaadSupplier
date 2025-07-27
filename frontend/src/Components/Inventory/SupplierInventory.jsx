import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Package,
  Trash,
  Search,
  Filter,
  Save,
  X,
  AlertCircle,
  Check,
  Delete,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SupplierDashboard = () => {
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unitType: "kg",
    pricePerUnit: "",
    availableQuantity: "",
  });

  // Categories for filtering
  const categories = [
    "vegetables",
    "spices",
    "grains",
    "dairy",
    "meat",
    "fruits",
    "oils",
    "others",
  ];
  const unitTypes = ["kg", "litre", "piece", "dozen", "gram", "ml"];

  const fetchMyItems = async () => {
    try {
      //   setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        showNotification("Please log in to continue", "error");
        return;
      }

      const response = await fetch("http://localhost:5000/api/items/my", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await response.json();
      setItems(data);

      // Create inventory data from items (assuming availableQuantity is part of item data)
      const inventoryData = data.map((item) => ({
        _id: item._id + "_inv",
        item: item._id,
        availableQuantity: item.availableQuantity || 0,
        lastUpdated: new Date().toISOString(),
      }));
      setInventory(inventoryData);
    } catch (error) {
      console.error("Error fetching items:", error);
      showNotification("Failed to load items", "error");
    } finally {
      //   setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchMyItems();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showNotification("Supplier not logged in!", "error");
        return;
      }

      console.log(formData.availableQuantity);
      const response = await fetch("http://localhost:5000/api/items/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          unitType: formData.unitType,
          pricePerUnit: parseFloat(formData.pricePerUnit),
          availableQuantity: parseFloat(formData.availableQuantity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to add item");
      }

      // Optional: Add newly created item to UI
      const newItem = {
        ...data.item,
        availableQuantity: parseFloat(formData.availableQuantity),
      };

      setItems((prev) => [...prev, newItem]);
      showNotification("Item added successfully!");
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding item:", error);
      showNotification("Something went wrong. Please try again.", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      unitType: "kg",
      pricePerUnit: "",
      availableQuantity: "",
    });
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    const itemInventory = inventory.find((inv) => inv.item === item._id);
    setFormData({
      name: item.name,
      category: item.category,
      unitType: item.unitType,
      pricePerUnit: item.pricePerUnit.toString(),
      availableQuantity: itemInventory
        ? itemInventory.availableQuantity.toString()
        : "0",
    });
    setEditingItem(item);
    setShowEditModal(true);
  };

  const getItemInventory = (itemId) => {
    return inventory.find((inv) => inv.item === itemId);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <button
        onClick={() => {
          navigate("supplier/orders");
        }}
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium fixed bottom-4 right-4 z-50 shadow-lg"
      >
        View Orders
      </button>
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <Check size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
            Supplier Dashboard
          </h1>
          <p className="text-gray-400">
            Manage your inventory and track your items
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Items</p>
                <p className="text-2xl font-bold text-white">{items.length}</p>
              </div>
              <Package className="text-orange-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Categories</p>
                <p className="text-2xl font-bold text-white">
                  {new Set(items.map((item) => item.category)).size}
                </p>
              </div>
              <Filter className="text-orange-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Low Stock Items</p>
                <p className="text-2xl font-bold text-white">
                  {inventory.filter((inv) => inv.availableQuantity < 50).length}
                </p>
              </div>
              <AlertCircle className="text-red-400" size={24} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 w-full md:w-64"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-gray-800/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-400"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
            >
              <Plus size={16} />
              Add New Item
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const itemInventory = getItemInventory(item._id);
            const isLowStock =
              itemInventory && itemInventory.availableQuantity < 50;

            return (
              <div
                key={item._id}
                className="bg-gray-800/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm capitalize">
                      {item.category}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-gray-400 hover:text-orange-400 transition-colors p-2"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-orange-400 transition-colors p-2">
                    <Trash size={16} />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Price per {item.unitType}:
                    </span>
                    <span className="text-white font-medium">
                      ₹{item.pricePerUnit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Available:</span>
                    <span
                      className={`font-medium ${
                        isLowStock ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {itemInventory ? itemInventory.availableQuantity : 0}{" "}
                      {item.unitType}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">
              No items found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Item"
      >
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Item Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                placeholder="Enter item name"
              />
            </div>

            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-400"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Unit Type
                </label>
                <select
                  value={formData.unitType}
                  onChange={(e) =>
                    setFormData({ ...formData, unitType: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-400"
                >
                  {unitTypes.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Price per Unit (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.pricePerUnit}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerUnit: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Available Quantity
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.availableQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableQuantity: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-gray-800/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                placeholder="Enter available quantity"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Add Item
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Item"
      >
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Item Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                placeholder="Enter item name"
              />
            </div>

            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-400"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Unit Type
                </label>
                <select
                  value={formData.unitType}
                  onChange={(e) =>
                    setFormData({ ...formData, unitType: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-400"
                >
                  {unitTypes.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Price per Unit (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.pricePerUnit}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerUnit: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Available Quantity
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.availableQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableQuantity: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-gray-800/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                placeholder="Enter available quantity"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Update Item
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SupplierDashboard;
