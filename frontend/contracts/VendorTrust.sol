// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VendorTrust is ReentrancyGuard, Ownable {
    struct Rating {
        address reviewer;
        uint8 score; // 1-5 rating
        string comment;
        uint256 timestamp;
        string supplierName;
        bool verified; // For future verification system
    }
    
    struct Supplier {
        string name;
        string description;
        string contactInfo;
        uint256 totalRatings;
        uint256 totalScore;
        bool exists;
        bool isVerified;
        uint256 registrationTime;
    }
    
    // State variables
    mapping(string => Supplier) public suppliers;
    mapping(string => Rating[]) public supplierRatings;
    mapping(address => mapping(string => bool)) public hasRated;
    mapping(address => string[]) public userRatings; // Track user's ratings
    
    string[] public supplierList;
    uint256 public totalSuppliers;
    uint256 public totalRatings;
    
    // Events
    event RatingAdded(
        string indexed supplierName,
        address indexed reviewer,
        uint8 score,
        string comment,
        uint256 timestamp
    );
    
    event SupplierRegistered(
        string indexed supplierName,
        address indexed registrar,
        uint256 timestamp
    );
    
    event SupplierVerified(
        string indexed supplierName,
        address indexed verifier,
        uint256 timestamp
    );
    
    // Modifiers
    modifier supplierExists(string memory _supplierName) {
        require(suppliers[_supplierName].exists, "Supplier does not exist");
        _;
    }
    
    modifier validRating(uint8 _score) {
        require(_score >= 1 && _score <= 5, "Score must be between 1 and 5");
        _;
    }
    
    modifier hasNotRated(string memory _supplierName) {
        require(!hasRated[msg.sender][_supplierName], "You have already rated this supplier");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        totalSuppliers = 0;
        totalRatings = 0;
    }
    
    // Register a new supplier
    function registerSupplier(
        string memory _name,
        string memory _description,
        string memory _contactInfo
    ) public {
        require(!suppliers[_name].exists, "Supplier already exists");
        require(bytes(_name).length > 0, "Supplier name cannot be empty");
        
        suppliers[_name] = Supplier({
            name: _name,
            description: _description,
            contactInfo: _contactInfo,
            totalRatings: 0,
            totalScore: 0,
            exists: true,
            isVerified: false,
            registrationTime: block.timestamp
        });
        
        supplierList.push(_name);
        totalSuppliers++;
        
        emit SupplierRegistered(_name, msg.sender, block.timestamp);
    }
    
    // Add rating to a supplier
    function addRating(
        string memory _supplierName,
        uint8 _score,
        string memory _comment
    ) 
        public 
        nonReentrant
        supplierExists(_supplierName)
        validRating(_score)
        hasNotRated(_supplierName)
    {
        require(bytes(_comment).length > 0, "Comment cannot be empty");
        
        Rating memory newRating = Rating({
            reviewer: msg.sender,
            score: _score,
            comment: _comment,
            timestamp: block.timestamp,
            supplierName: _supplierName,
            verified: false
        });
        
        supplierRatings[_supplierName].push(newRating);
        suppliers[_supplierName].totalRatings++;
        suppliers[_supplierName].totalScore += _score;
        hasRated[msg.sender][_supplierName] = true;
        userRatings[msg.sender].push(_supplierName);
        totalRatings++;
        
        emit RatingAdded(_supplierName, msg.sender, _score, _comment, block.timestamp);
    }
    
    // Get supplier rating (returns average * 100 for precision)
    function getSupplierRating(string memory _supplierName) 
        public 
        view 
        supplierExists(_supplierName)
        returns (uint256 avgRating, uint256 totalRatings_) 
    {
        if (suppliers[_supplierName].totalRatings == 0) {
            return (0, 0);
        }
        
        avgRating = (suppliers[_supplierName].totalScore * 100) / suppliers[_supplierName].totalRatings;
        totalRatings_ = suppliers[_supplierName].totalRatings;
    }
    
    // Get all reviews for a supplier
    function getSupplierReviews(string memory _supplierName) 
        public 
        view 
        supplierExists(_supplierName)
        returns (Rating[] memory) 
    {
        return supplierRatings[_supplierName];
    }
    
    // Get supplier details
    function getSupplierDetails(string memory _supplierName)
        public
        view
        supplierExists(_supplierName)
        returns (
            string memory name,
            string memory description,
            string memory contactInfo,
            uint256 totalRatings_,
            uint256 avgRating,
            bool isVerified,
            uint256 registrationTime
        )
    {
        Supplier memory supplier = suppliers[_supplierName];
        uint256 avg = supplier.totalRatings > 0 ? 
            (supplier.totalScore * 100) / supplier.totalRatings : 0;
            
        return (
            supplier.name,
            supplier.description,
            supplier.contactInfo,
            supplier.totalRatings,
            avg,
            supplier.isVerified,
            supplier.registrationTime
        );
    }
    
    // Get all suppliers
    function getAllSuppliers() public view returns (string[] memory) {
        return supplierList;
    }
    
    // Get user's ratings
    function getUserRatings(address _user) public view returns (string[] memory) {
        return userRatings[_user];
    }
    
    // Get platform statistics
    function getPlatformStats() 
        public 
        view 
        returns (
            uint256 totalSuppliers_,
            uint256 totalRatings_,
            uint256 totalVerifiedSuppliers
        ) 
    {
        uint256 verified = 0;
        for (uint256 i = 0; i < supplierList.length; i++) {
            if (suppliers[supplierList[i]].isVerified) {
                verified++;
            }
        }
        
        return (totalSuppliers, totalRatings, verified);
    }
    
    // Owner functions
    function verifySupplier(string memory _supplierName) 
        public 
        onlyOwner 
        supplierExists(_supplierName) 
    {
        suppliers[_supplierName].isVerified = true;
        emit SupplierVerified(_supplierName, msg.sender, block.timestamp);
    }
    
    function unverifySupplier(string memory _supplierName) 
        public 
        onlyOwner 
        supplierExists(_supplierName) 
    {
        suppliers[_supplierName].isVerified = false;
    }
    
    // Emergency function to pause contract (if needed)
    function emergencyPause() public onlyOwner {
        // Implementation for emergency pause if needed
        // This is a placeholder for more advanced pause functionality
    }
}