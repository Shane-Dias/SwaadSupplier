import jwt from "jsonwebtoken";
import Supplier from "../models/supplier.js"
// import Supplier from "../models/Supplier";

export const protectSupplier = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const supplier = await Supplier.findById(decoded.id).select("-password");

    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });

    req.user = { id: supplier._id }; // Attach supplier ID to req
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    console.log(err);
  }
};
