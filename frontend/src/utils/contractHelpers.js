import Web3 from 'web3';

// Network configurations
export const NETWORKS = {
  localhost: {
    chainId: 1337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
  },
  mumbai: {
    chainId: 80001,
    name: 'Mumbai Testnet',
    rpcUrl: 'https://polygon-mumbai.infura.io/v3/',
  }
};

// Load contract configuration based on current network
export const loadContractConfig = async (web3) => {
  try {
    const chainId = await web3.eth.getChainId();
    let networkName;
    
    switch (chainId) {
      case 1337:
        networkName = 'localhost';
        break;
      case 11155111:
        networkName = 'sepolia';
        break;
      case 80001:
        networkName = 'mumbai';
        break;
      default:
        throw new Error(`Unsupported network: ${chainId}`);
    }
    
    // Import contract configuration
    const contractConfig = await import(`../contracts/contract-${networkName}.json`);
    return contractConfig.default;
  } catch (error) {
    console.error('Failed to load contract config:', error);
    throw new Error('Contract not deployed on this network');
  }
};

// Initialize Web3 and MetaMask
export const initWeb3 = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect to MetaMask.');
      }
      
      return {
        web3,
        account: accounts[0],
        isConnected: true
      };
    } catch (error) {
      throw new Error(`Failed to connect to MetaMask: ${error.message}`);
    }
  } else {
    throw new Error('MetaMask not detected. Please install MetaMask to use blockchain features.');
  }
};

// Switch to correct network
export const switchNetwork = async (chainId) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      const network = Object.values(NETWORKS).find(n => n.chainId === chainId);
      if (network) {
        await addNetwork(network);
      }
    } else {
      throw switchError;
    }
  }
};

// Add network to MetaMask
const addNetwork = async (network) => {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${network.chainId.toString(16)}`,
        chainName: network.name,
        rpcUrls: [network.rpcUrl],
        nativeCurrency: {
          name: network.chainId === 80001 ? 'MATIC' : 'ETH',
          symbol: network.chainId === 80001 ? 'MATIC' : 'ETH',
          decimals: 18
        }
      }]
    });
  } catch (error) {
    throw new Error(`Failed to add network: ${error.message}`);
  }
};

// Initialize contract
export const initContract = async (web3) => {
  try {
    const contractConfig = await loadContractConfig(web3);
    const contract = new web3.eth.Contract(contractConfig.abi, contractConfig.address);
    
    return {
      contract,
      address: contractConfig.address,
      network: contractConfig.network
    };
  } catch (error) {
    throw new Error(`Failed to initialize contract: ${error.message}`);
  }
};

// Contract interaction helpers
export const contractHelpers = {
  // Register a new supplier
  registerSupplier: async (contract, account, name, description, contactInfo) => {
    try {
      const receipt = await contract.methods
        .registerSupplier(name, description, contactInfo)
        .send({ from: account });
      return receipt;
    } catch (error) {
      throw new Error(`Failed to register supplier: ${error.message}`);
    }
  },

  // Add rating to supplier
  addRating: async (contract, account, supplierName, score, comment) => {
    try {
      const receipt = await contract.methods
        .addRating(supplierName, score, comment)
        .send({ from: account });
      return receipt;
    } catch (error) {
      throw new Error(`Failed to add rating: ${error.message}`);
    }
  },

  // Get all suppliers with their ratings
  getAllSuppliersWithRatings: async (contract) => {
    try {
      const supplierNames = await contract.methods.getAllSuppliers().call();
      
      const suppliers = await Promise.all(
        supplierNames.map(async (name) => {
          const [details, rating] = await Promise.all([
            contract.methods.getSupplierDetails(name).call(),
            contract.methods.getSupplierRating(name).call()
          ]);
          
          return {
            name: details.name,
            description: details.description,
            contactInfo: details.contactInfo,
            totalRatings: parseInt(details.totalRatings_),
            avgRating: parseInt(rating.avgRating) / 100,
            isVerified: details.isVerified,
            registrationTime: new Date(parseInt(details.registrationTime) * 1000)
          };
        })
      );
      
      return suppliers;
    } catch (error) {
      throw new Error(`Failed to load suppliers: ${error.message}`);
    }
  },

  // Get reviews for a specific supplier
  getSupplierReviews: async (contract, supplierName) => {
    try {
      const reviewsData = await contract.methods.getSupplierReviews(supplierName).call();
      
      return reviewsData.map(review => ({
        reviewer: review.reviewer,
        score: parseInt(review.score),
        comment: review.comment,
        timestamp: new Date(parseInt(review.timestamp) * 1000),
        supplierName: review.supplierName,
        verified: review.verified
      }));
    } catch (error) {
      throw new Error(`Failed to load reviews: ${error.message}`);
    }
  },

  // Get platform statistics
  getPlatformStats: async (contract) => {
    try {
      const stats = await contract.methods.getPlatformStats().call();
      return {
        totalSuppliers: parseInt(stats.totalSuppliers_),
        totalRatings: parseInt(stats.totalRatings_),
        totalVerifiedSuppliers: parseInt(stats.totalVerifiedSuppliers)
      };
    } catch (error) {
      throw new Error(`Failed to load platform stats: ${error.message}`);
    }
  },

  // Get user's ratings
  getUserRatings: async (contract, userAddress) => {
    try {
      const userRatings = await contract.methods.getUserRatings(userAddress).call();
      return userRatings;
    } catch (error) {
      throw new Error(`Failed to load user ratings: ${error.message}`);
    }
  }
};

// Event listeners for contract events
export const setupEventListeners = (contract, callbacks = {}) => {
  const events = {};

  // Listen for new supplier registrations
  if (callbacks.onSupplierRegistered) {
    events.supplierRegistered = contract.events.SupplierRegistered()
      .on('data', callbacks.onSupplierRegistered)
      .on('error', console.error);
  }

  // Listen for new ratings
  if (callbacks.onRatingAdded) {
    events.ratingAdded = contract.events.RatingAdded()
      .on('data', callbacks.onRatingAdded)
      .on('error', console.error);
  }

  // Listen for supplier verifications
  if (callbacks.onSupplierVerified) {
    events.supplierVerified = contract.events.SupplierVerified()
      .on('data', callbacks.onSupplierVerified)
      .on('error', console.error);
  }

  return events;
};

// Format address for display
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format rating for display
export const formatRating = (rating) => {
  return (rating / 100).toFixed(1);
};

// Validate rating input
export const validateRating = (score) => {
  return score >= 1 && score <= 5;
};

// Check if user can rate supplier
export const canUserRate = async (contract, userAddress, supplierName) => {
  try {
    const hasRated = await contract.methods.hasRated(userAddress, supplierName).call();
    return !hasRated;
  } catch (error) {
    console.error('Error checking if user can rate:', error);
    return false;
  }
};