const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VendorTrust", function () {
  let VendorTrust;
  let vendorTrust;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    VendorTrust = await ethers.getContractFactory("VendorTrust");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a fresh contract for each test
    vendorTrust = await VendorTrust.deploy();
    await vendorTrust.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await vendorTrust.owner()).to.equal(owner.address);
    });

    it("Should start with zero suppliers and ratings", async function () {
      const stats = await vendorTrust.getPlatformStats();
      expect(stats.totalSuppliers_).to.equal(0);
      expect(stats.totalRatings_).to.equal(0);
      expect(stats.totalVerifiedSuppliers).to.equal(0);
    });
  });

  describe("Supplier Registration", function () {
    it("Should register a new supplier", async function () {
      await vendorTrust.registerSupplier(
        "Test Supplier",
        "Test Description",
        "test@supplier.com"
      );

      const suppliers = await vendorTrust.getAllSuppliers();
      expect(suppliers.length).to.equal(1);
      expect(suppliers[0]).to.equal("Test Supplier");

      const stats = await vendorTrust.getPlatformStats();
      expect(stats.totalSuppliers_).to.equal(1);
    });

    it("Should not allow duplicate supplier names", async function () {
      await vendorTrust.registerSupplier(
        "Test Supplier",
        "Test Description",
        "test@supplier.com"
      );

      await expect(
        vendorTrust.registerSupplier(
          "Test Supplier",
          "Another Description",
          "another@supplier.com"
        )
      ).to.be.revertedWith("Supplier already exists");
    });

    it("Should not allow empty supplier names", async function () {
      await expect(
        vendorTrust.registerSupplier("", "Test Description", "test@supplier.com")
      ).to.be.revertedWith("Supplier name cannot be empty");
    });
  });

  describe("Rating System", function () {
    beforeEach(async function () {
      // Register a supplier for rating tests
      await vendorTrust.registerSupplier(
        "Test Supplier",
        "Test Description",
        "test@supplier.com"
      );
    });

    it("Should add a rating to a supplier", async function () {
      await vendorTrust.connect(addr1).addRating(
        "Test Supplier",
        5,
        "Excellent quality products"
      );

      const rating = await vendorTrust.getSupplierRating("Test Supplier");
      expect(rating.avgRating).to.equal(500); // 5.00 * 100
      expect(rating.totalRatings_).to.equal(1);

      const reviews = await vendorTrust.getSupplierReviews("Test Supplier");
      expect(reviews.length).to.equal(1);
      expect(reviews[0].score).to.equal(5);
      expect(reviews[0].comment).to.equal("Excellent quality products");
      expect(reviews[0].reviewer).to.equal(addr1.address);
    });

    it("Should calculate average rating correctly", async function () {
      await vendorTrust.connect(addr1).addRating("Test Supplier", 5, "Great!");
      await vendorTrust.connect(addr2).addRating("Test Supplier", 3, "Okay");

      const rating = await vendorTrust.getSupplierRating("Test Supplier");
      expect(rating.avgRating).to.equal(400); // 4.00 * 100
      expect(rating.totalRatings_).to.equal(2);
    });

    it("Should not allow duplicate ratings from same address", async function () {
      await vendorTrust.connect(addr1).addRating("Test Supplier", 5, "Great!");

      await expect(
        vendorTrust.connect(addr1).addRating("Test Supplier", 4, "Good")
      ).to.be.revertedWith("You have already rated this supplier");
    });

    it("Should not allow ratings outside 1-5 range", async function () {
      await expect(
        vendorTrust.connect(addr1).addRating("Test Supplier", 0, "Bad")
      ).to.be.revertedWith("Score must be between 1 and 5");

      await expect(
        vendorTrust.connect(addr1).addRating("Test Supplier", 6, "Too good")
      ).to.be.revertedWith("Score must be between 1 and 5");
    });

    it("Should not allow empty comments", async function () {
      await expect(
        vendorTrust.connect(addr1).addRating("Test Supplier", 5, "")
      ).to.be.revertedWith("Comment cannot be empty");
    });

    it("Should not allow rating non-existent suppliers", async function () {
      await expect(
        vendorTrust.connect(addr1).addRating("Fake Supplier", 5, "Great!")
      ).to.be.revertedWith("Supplier does not exist");
    });
  });

  describe("Supplier Verification", function () {
    beforeEach(async function () {
      await vendorTrust.registerSupplier(
        "Test Supplier",
        "Test Description",
        "test@supplier.com"
      );
    });

    it("Should allow owner to verify suppliers", async function () {
      await vendorTrust.verifySupplier("Test Supplier");

      const details = await vendorTrust.getSupplierDetails("Test Supplier");
      expect(details.isVerified).to.be.true;

      const stats = await vendorTrust.getPlatformStats();
      expect(stats.totalVerifiedSuppliers).to.equal(1);
    });

    it("Should not allow non-owners to verify suppliers", async function () {
      await expect(
        vendorTrust.connect(addr1).verifySupplier("Test Supplier")
      ).to.be.revertedWithCustomError(vendorTrust, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to unverify suppliers", async function () {
      await vendorTrust.verifySupplier("Test Supplier");
      await vendorTrust.unverifySupplier("Test Supplier");

      const details = await vendorTrust.getSupplierDetails("Test Supplier");
      expect(details.isVerified).to.be.false;
    });
  });

  describe("User Ratings Tracking", function () {
    beforeEach(async function () {
      await vendorTrust.registerSupplier("Supplier 1", "Desc 1", "contact1");
      await vendorTrust.registerSupplier("Supplier 2", "Desc 2", "contact2");
    });

    it("Should track user ratings", async function () {
      await vendorTrust.connect(addr1).addRating("Supplier 1", 5, "Great!");
      await vendorTrust.connect(addr1).addRating("Supplier 2", 4, "Good!");

      const userRatings = await vendorTrust.getUserRatings(addr1.address);
      expect(userRatings.length).to.equal(2);
      expect(userRatings).to.include("Supplier 1");
      expect(userRatings).to.include("Supplier 2");
    });
  });

  describe("Platform Statistics", function () {
    it("Should return correct platform statistics", async function () {
      // Add suppliers
      await vendorTrust.registerSupplier("Supplier 1", "Desc 1", "contact1");
      await vendorTrust.registerSupplier("Supplier 2", "Desc 2", "contact2");
      
      // Verify one supplier
      await vendorTrust.verifySupplier("Supplier 1");
      
      // Add ratings
      await vendorTrust.connect(addr1).addRating("Supplier 1", 5, "Great!");
      await vendorTrust.connect(addr2).addRating("Supplier 2", 4, "Good!");

      const stats = await vendorTrust.getPlatformStats();
      expect(stats.totalSuppliers_).to.equal(2);
      expect(stats.totalRatings_).to.equal(2);
      expect(stats.totalVerifiedSuppliers).to.equal(1);
    });
  });
});