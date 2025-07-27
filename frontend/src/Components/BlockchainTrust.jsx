import React, { useState, useEffect } from 'react';
import { Star, Shield, Users, MessageCircle, Plus, CheckCircle, AlertCircle, TrendingUp, Wallet } from 'lucide-react';

const BlockchainTrust = () => {
  // State management
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    totalSuppliers: 12,
    totalRatings: 89,
    totalVerifiedSuppliers: 8
  });
  
  // UI state
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    description: '',
    contactInfo: ''
  });
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  // Mock data for demo
  const mockSuppliers = [
    {
      name: "TechCorp Solutions",
      description: "Leading provider of enterprise software solutions",
      contactInfo: "contact@techcorp.com",
      avgRating: 4.5,
      totalRatings: 23,
      isVerified: true
    },
    {
      name: "Global Manufacturing Ltd",
      description: "Industrial manufacturing and supply chain services",
      contactInfo: "info@globalmanuf.com",
      avgRating: 4.2,
      totalRatings: 18,
      isVerified: true
    },
    {
      name: "Digital Innovations Inc",
      description: "Cutting-edge digital transformation services",
      contactInfo: "hello@digitalinnovations.com",
      avgRating: 4.8,
      totalRatings: 31,
      isVerified: false
    }
  ];

  const mockReviews = [
    {
      score: 5,
      comment: "Exceptional service quality and timely delivery. Highly recommended for enterprise projects.",
      reviewer: "0x742d35Cc6634C0532925a3b8D4C4E0B8b9123456",
      timestamp: new Date('2024-07-15'),
      verified: true
    },
    {
      score: 4,
      comment: "Good communication and professional team. Minor delays but overall satisfied with the outcome.",
      reviewer: "0x8ba1f109551bD432803012645Hac189B17654321",
      timestamp: new Date('2024-07-10'),
      verified: true
    },
    {
      score: 5,
      comment: "Outstanding technical expertise. They delivered exactly what was promised and more.",
      reviewer: "0x9cd2461B7a36D9f3901c8B5E4C8F0B1D9E987654",
      timestamp: new Date('2024-07-05'),
      verified: false
    }
  ];

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Get network name
  const getNetworkName = (chainId) => {
    const networks = {
      '0x1': 'Ethereum Mainnet',
      '0x3': 'Ropsten Testnet',
      '0x4': 'Rinkeby Testnet',
      '0x5': 'Goerli Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai Testnet',
      '0xa86a': 'Avalanche Mainnet',
      '0x38': 'BSC Mainnet'
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  // Initialize Web3 and connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      // Get network information
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      const networkName = getNetworkName(chainId);

      // Set state
      setAccount(accounts[0]);
      setNetwork(networkName);
      setIsConnected(true);
      setWeb3(true); // Mock web3 instance
      setSuppliers(mockSuppliers);
      setSuccess('Wallet connected successfully!');

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
          setSuccess('Account changed successfully!');
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', (chainId) => {
        setNetwork(getNetworkName(chainId));
        setSuccess('Network changed successfully!');
      });

    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      if (error.code === 4001) {
        setError('Connection rejected. Please approve the connection in MetaMask.');
      } else if (error.code === -32002) {
        setError('Connection request pending. Please check MetaMask.');
      } else {
        setError('Failed to connect to MetaMask: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWeb3(null);
    setAccount('');
    setIsConnected(false);
    setNetwork('');
    setSuppliers([]);
    setSelectedSupplier(null);
    setReviews([]);
    setSuccess('Wallet disconnected successfully!');
  };

  // Add new supplier
  const addSupplier = async () => {
    if (!newSupplier.name.trim()) {
      setError('Supplier name is required');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSupplierData = {
        ...newSupplier,
        avgRating: 0,
        totalRatings: 0,
        isVerified: false
      };
      
      setSuppliers(prev => [...prev, newSupplierData]);
      setPlatformStats(prev => ({
        ...prev,
        totalSuppliers: prev.totalSuppliers + 1
      }));
      
      setNewSupplier({ name: '', description: '', contactInfo: '' });
      setShowAddSupplier(false);
      setSuccess('Supplier registered successfully on the blockchain!');
    } catch (error) {
      setError('Failed to add supplier: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add review
  const addReview = async () => {
    if (!selectedSupplier || !newReview.comment.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const review = {
        score: newReview.rating,
        comment: newReview.comment,
        reviewer: account,
        timestamp: new Date(),
        verified: true
      };
      
      setReviews(prev => [review, ...prev]);
      
      // Update supplier rating
      setSuppliers(prev => prev.map(supplier => {
        if (supplier.name === selectedSupplier.name) {
          const newTotal = supplier.totalRatings + 1;
          const newAvg = ((supplier.avgRating * supplier.totalRatings) + newReview.rating) / newTotal;
          return {
            ...supplier,
            avgRating: newAvg,
            totalRatings: newTotal
          };
        }
        return supplier;
      }));
      
      setPlatformStats(prev => ({
        ...prev,
        totalRatings: prev.totalRatings + 1
      }));
      
      setNewReview({ rating: 5, comment: '' });
      setShowAddReview(false);
      setSuccess('Review added successfully to the blockchain!');
    } catch (error) {
      setError('Failed to add review: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Render star rating
  const renderStars = (rating, interactive = false, onClick = null) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={() => interactive && onClick && onClick(i + 1)}
      />
    ));
  };

  // Load reviews when supplier is selected
  useEffect(() => {
    if (selectedSupplier) {
      setReviews(mockReviews);
    }
  }, [selectedSupplier]);

  // Clear messages after delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Check if already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({
              method: 'eth_chainId',
            });
            
            setAccount(accounts[0]);
            setNetwork(getNetworkName(chainId));
            setIsConnected(true);
            setWeb3(true);
            setSuppliers(mockSuppliers);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Connection screen
  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-8 text-center">
          <Shield className="w-20 h-20 text-blue-500 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-blue-900 mb-4">Blockchain Trust System</h3>
          <p className="text-blue-700 mb-6 text-lg">
            Connect your MetaMask wallet to access transparent, immutable supplier ratings
          </p>
          
          {!isMetaMaskInstalled() ? (
            <div>
              <p className="text-red-600 mb-4">MetaMask is not installed</p>
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold inline-block"
              >
                Install MetaMask
              </a>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              disabled={loading}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 font-semibold flex items-center gap-3 mx-auto"
            >
              <Wallet className="w-5 h-5" />
              {loading ? 'Connecting...' : 'Connect MetaMask Wallet'}
            </button>
          )}
          
          <div className="mt-6 text-sm text-gray-600">
            <p>✓ Transparent ratings stored on blockchain</p>
            <p>✓ Immutable reviews that can't be deleted</p>
            <p>✓ Trustless verification system</p>
          </div>
        </div>
        
        {/* Error display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
              <Shield className="w-10 h-10 text-blue-500" />
              Blockchain Trust System
            </h2>
            <p className="text-gray-600 text-lg">
              Transparent, immutable supplier ratings powered by blockchain technology
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              Network: <span className="font-medium">{network}</span>
            </div>
            <div className="text-sm text-gray-500 mb-1 flex items-center justify-end gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Connected: <span className="font-medium">{formatAddress(account)}</span>
            </div>
            <button
              onClick={disconnectWallet}
              className="text-xs text-red-600 hover:text-red-800 underline"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{platformStats.totalSuppliers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{platformStats.totalRatings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Verified Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{platformStats.totalVerifiedSuppliers}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Suppliers List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Trusted Suppliers</h3>
            <button
              onClick={() => setShowAddSupplier(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Supplier
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {suppliers.length > 0 ? (
              suppliers.map((supplier, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedSupplier?.name === supplier.name
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedSupplier(supplier)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                      {supplier.isVerified && (
                        <CheckCircle className="w-5 h-5 text-green-500" title="Verified Supplier" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(supplier.avgRating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{supplier.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {supplier.totalRatings} reviews
                    </span>
                    <span className="font-medium">
                      {supplier.avgRating > 0 ? supplier.avgRating.toFixed(1) : 'No ratings'}/5.0
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No suppliers registered yet</p>
                <p className="text-sm text-gray-400">Be the first to add a supplier!</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {selectedSupplier ? (
                <span className="flex items-center gap-2">
                  Reviews for {selectedSupplier.name}
                  {selectedSupplier.isVerified && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </span>
              ) : (
                'Select a Supplier'
              )}
            </h3>
            {selectedSupplier && (
              <button
                onClick={() => setShowAddReview(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                Add Review
              </button>
            )}
          </div>

          {selectedSupplier ? (
            <div>
              {/* Supplier Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {renderStars(selectedSupplier.avgRating)}
                    <span className="ml-2 font-semibold">
                      {selectedSupplier.avgRating.toFixed(1)}/5.0
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {selectedSupplier.totalRatings} reviews
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{selectedSupplier.description}</p>
                <p className="text-xs text-gray-500">Contact: {selectedSupplier.contactInfo}</p>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.score)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-xs text-gray-500">
                        By: {formatAddress(review.reviewer)}
                        {review.verified && (
                          <span className="ml-2 text-green-600">✓ Verified</span>
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No reviews yet for this supplier</p>
                    <p className="text-sm text-gray-400">Be the first to leave a review!</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Select a supplier to view reviews</p>
              <p className="text-sm text-gray-400">Click on any supplier from the list to see their ratings and reviews</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showAddSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Add New Supplier</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Supplier name *"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Description"
                value={newSupplier.description}
                onChange={(e) => setNewSupplier({...newSupplier, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Contact information"
                value={newSupplier.contactInfo}
                onChange={(e) => setNewSupplier({...newSupplier, contactInfo: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={addSupplier}
                disabled={loading || !newSupplier.name.trim()}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium"
              >
                {loading ? 'Adding...' : 'Add Supplier'}
              </button>
              <button
                onClick={() => setShowAddSupplier(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showAddReview && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Add Review for {selectedSupplier.name}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating *</label>
              <div className="flex gap-1">
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview({...newReview, rating})
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Comment *</label>
              <textarea
                placeholder="Share your experience with this supplier..."
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={addReview}
                disabled={loading || !newReview.comment.trim()}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
              >
                {loading ? 'Adding...' : 'Add Review'}
              </button>
              <button
                onClick={() => setShowAddReview(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainTrust;