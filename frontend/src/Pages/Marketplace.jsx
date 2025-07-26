import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Clock, Truck, ShoppingCart, Heart, Phone, MessageCircle } from 'lucide-react';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  // Sample suppliers data
  const suppliers = [
    {
      id: 1,
      name: "Fresh Veggie Hub",
      category: "vegetables",
      location: "Andheri, Mumbai",
      rating: 4.8,
      reviews: 234,
      deliveryTime: "30-45 mins",
      minOrder: 500,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop",
      specialties: ["Onions", "Tomatoes", "Potatoes", "Leafy Greens"],
      priceRange: "₹20-150/kg",
      verified: true,
      phone: "+91 98765 43210",
      description: "Premium quality vegetables sourced directly from farms. Best prices guaranteed.",
      offers: ["Bulk discount 15%", "Free delivery above ₹1000"]
    },
    {
      id: 2,
      name: "Spice Master",
      category: "spices",
      location: "Crawford Market, Mumbai",
      rating: 4.9,
      reviews: 456,
      deliveryTime: "20-30 mins",
      minOrder: 300,
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop",
      specialties: ["Garam Masala", "Turmeric", "Red Chili", "Cumin"],
      priceRange: "₹50-500/kg",
      verified: true,
      phone: "+91 98765 43211",
      description: "Authentic spices with traditional grinding methods. Export quality guaranteed.",
      offers: ["Buy 3 get 1 free", "Sample packs available"]
    },
    {
      id: 3,
      name: "Meat & More",
      category: "meat",
      location: "Bandra, Mumbai",
      rating: 4.7,
      reviews: 189,
      deliveryTime: "45-60 mins",
      minOrder: 800,
      image: "https://images.unsplash.com/photo-1588347818668-d4755e8e4eee?w=300&h=200&fit=crop",
      specialties: ["Chicken", "Mutton", "Fish", "Prawns"],
      priceRange: "₹200-800/kg",
      verified: true,
      phone: "+91 98765 43212",
      description: "Fresh halal meat and seafood. Daily fresh stock with proper cold storage.",
      offers: ["Weekend discount 20%", "Bulk orders welcome"]
    },
    {
      id: 4,
      name: "Oil & Grains Co.",
      category: "oils",
      location: "Dadar, Mumbai",
      rating: 4.6,
      reviews: 312,
      deliveryTime: "25-40 mins",
      minOrder: 600,
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop",
      specialties: ["Sunflower Oil", "Mustard Oil", "Coconut Oil", "Rice Bran Oil"],
      priceRange: "₹80-200/L",
      verified: true,
      phone: "+91 98765 43213",
      description: "Pure and authentic cooking oils. Wholesale rates for bulk purchases.",
      offers: ["Monthly subscription 10% off", "Quality guarantee"]
    },
    {
      id: 5,
      name: "Dairy Fresh",
      category: "dairy",
      location: "Worli, Mumbai",
      rating: 4.5,
      reviews: 287,
      deliveryTime: "15-25 mins",
      minOrder: 200,
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop",
      specialties: ["Milk", "Paneer", "Curd", "Butter"],
      priceRange: "₹40-300/kg",
      verified: true,
      phone: "+91 98765 43214",
      description: "Fresh dairy products delivered daily. Farm to table quality.",
      offers: ["Daily delivery available", "Subscription discounts"]
    },
    {
      id: 6,
      name: "Street Snack Supplies",
      category: "snacks",
      location: "Borivali, Mumbai",
      rating: 4.4,
      reviews: 156,
      deliveryTime: "35-50 mins",
      minOrder: 400,
      image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=200&fit=crop",
      specialties: ["Puri", "Sev", "Papdi", "Namkeen"],
      priceRange: "₹30-150/kg",
      verified: true,
      phone: "+91 98765 43215",
      description: "Ready-to-use street food ingredients. Crispy and fresh guaranteed.",
      offers: ["Combo packs available", "Festival specials"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🏪' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'spices', name: 'Spices', icon: '🌶️' },
    { id: 'meat', name: 'Meat & Seafood', icon: '🍖' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'oils', name: 'Oils & Grains', icon: '🫒' },
    { id: 'snacks', name: 'Ready Ingredients', icon: '🥨' }
  ];

  const locations = [
    { id: 'all', name: 'All Mumbai' },
    { id: 'andheri', name: 'Andheri' },
    { id: 'bandra', name: 'Bandra' },
    { id: 'dadar', name: 'Dadar' },
    { id: 'worli', name: 'Worli' },
    { id: 'borivali', name: 'Borivali' }
  ];

  // Filter suppliers based on search and filters
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || 
                           supplier.location.toLowerCase().includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Sort suppliers
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'deliveryTime':
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      case 'minOrder':
        return a.minOrder - b.minOrder;
      default:
        return 0;
    }
  });

  const toggleFavorite = (supplierId) => {
    setFavorites(prev => 
      prev.includes(supplierId) 
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const SupplierCard = ({ supplier }) => (
    <div className="bg-gray-800/30 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/40 hover:bg-gray-800/40 transition-all duration-500 group hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={supplier.image} 
          alt={supplier.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {supplier.verified && (
          <div className="absolute top-2 left-2 bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            Verified
          </div>
        )}
        
        <button 
          onClick={() => toggleFavorite(supplier.id)}
          className="absolute top-2 right-2 w-7 h-7 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/40 transition-all duration-300 hover:scale-110"
        >
          <Heart 
            size={14} 
            className={favorites.includes(supplier.id) ? 'text-red-400 fill-current' : 'text-white/80'} 
          />
        </button>

        {/* Rating badge on image */}
        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
          <Star size={12} fill="currentColor" className="text-yellow-400" />
          <span className="font-medium">{supplier.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-semibold text-white group-hover:text-orange-400 transition-colors leading-tight">
            {supplier.name}
          </h3>
          <div className="text-xs text-white/50">
            ({supplier.reviews})
          </div>
        </div>

        <p className="text-white/60 text-xs mb-3 line-clamp-2 leading-relaxed">{supplier.description}</p>

        {/* Location & Delivery - Slim design */}
        <div className="flex items-center justify-between mb-3 text-xs text-white/50">
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span className="truncate">{supplier.location.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{supplier.deliveryTime.split('-')[0]} min</span>
          </div>
        </div>

        {/* Specialties - More compact */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {supplier.specialties.slice(0, 2).map((specialty, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 bg-orange-500/15 text-orange-300 text-xs rounded-full font-medium"
              >
                {specialty}
              </span>
            ))}
            {supplier.specialties.length > 2 && (
              <span className="px-2 py-0.5 bg-white/10 text-white/50 text-xs rounded-full">
                +{supplier.specialties.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Price & Min Order - Redesigned */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-orange-400 font-bold text-sm">{supplier.priceRange}</div>
            <div className="text-xs text-white/40">Min ₹{supplier.minOrder}</div>
          </div>
          {supplier.offers.length > 0 && (
            <div className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-md font-medium">
              🎉 Offer
            </div>
          )}
        </div>

        {/* Action Buttons - Slimmer */}
        <div className="flex gap-2">
          <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/25">
            <ShoppingCart size={14} />
            Order
          </button>
          <button className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105">
            <Phone size={14} className="text-white/80" />
          </button>
          <button className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105">
            <MessageCircle size={14} className="text-white/80" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header - Slimmer */}
      <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 border-b border-white/5">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Marketplace
          </h1>
          <p className="text-white/50 text-sm max-w-2xl">
            Discover trusted suppliers for street food ingredients. Quality guaranteed, competitive prices.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters - Compact */}
        <div className="mb-6 space-y-3">
          {/* Search Bar - Slimmer */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search suppliers, ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/40 backdrop-blur-sm border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/40 focus:border-orange-500/50 focus:outline-none focus:bg-gray-800/60 transition-all text-sm"
            />
          </div>

          {/* Category Filters - More compact */}
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all text-sm font-medium ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gray-800/40 text-white/60 hover:bg-gray-700/50 hover:text-white/80'
                }`}
              >
                <span className="text-sm">{category.icon}</span>
                <span className="hidden sm:block">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Additional Filters - Inline and compact */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-gray-800/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500/50 focus:outline-none min-w-0"
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500/50 focus:outline-none min-w-0"
            >
              <option value="rating">Best Rated</option>
              <option value="deliveryTime">Fastest</option>
              <option value="minOrder">Low Order</option>
            </select>

            <div className="flex items-center gap-2 text-white/50 text-sm ml-auto">
              <Filter size={14} />
              <span>{filteredSuppliers.length} results</span>
            </div>
          </div>
        </div>

        {/* Suppliers Grid - Better spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedSuppliers.map(supplier => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>

        {/* No Results */}
        {sortedSuppliers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-white mb-1">No suppliers found</h3>
            <p className="text-white/50 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;