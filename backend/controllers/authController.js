import Vendor from "../models/vendor.js";
import Supplier from "../models/supplier.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Vendor Registration
export const registerVendor = async (req, res) => {
  try {
    const { name, shopName, email, mobileNo, address, password } = req.body;

    // Check if vendor exists
    const vendorExists = await Vendor.findOne({ email });
    if (vendorExists) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create vendor
    const vendor = await Vendor.create({
      name,
      shopName,
      email,
      mobileNo,
      address,
      password: hashedPassword,
    });

    if (vendor) {
      res.status(201).json({
        _id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        role: vendor.role,
        token: generateToken(vendor._id, vendor.role),
      });
    } else {
      res.status(400).json({ message: "Invalid vendor data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supplier Registration
export const registerSupplier = async (req, res) => {
  try {
    const { name, shopName, email, mobileNo, address, password } = req.body;
    const fssaiCertificate = req.file.path; // Assuming you're using multer for file uploads

    // Check if supplier exists
    const supplierExists = await Supplier.findOne({ email });
    if (supplierExists) {
      return res.status(400).json({ message: "Supplier already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create supplier
    const supplier = await Supplier.create({
      name,
      shopName,
      email,
      mobileNo,
      address,
      password: hashedPassword,
      fssaiCertificate,
    });

    if (supplier) {
      res.status(201).json({
        _id: supplier._id,
        name: supplier.name,
        email: supplier.email,
        role: supplier.role,
        token: generateToken(supplier._id, supplier.role),
      });
    } else {
      res.status(400).json({ message: "Invalid supplier data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    if (role === "vendor") {
      user = await Vendor.findOne({ email });
    } else if (role === "supplier") {
      user = await Supplier.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get User name
export const getUserData = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === "vendor") {
      user = await Vendor.findById(decoded.id).select("-password");
    } else if (decoded.role === "supplier") {
      user = await Supplier.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      role: decoded.role,
      // Add other user data you want to expose
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
