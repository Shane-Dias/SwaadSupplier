import express from "express";
import { getVendorCreditStats, payBill, getSupplierCollections, sendReminder } from "../controllers/creditController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Vendor Routes
router.get("/vendor-summary", protect, getVendorCreditStats);
router.post("/pay", protect, payBill);

// Supplier Routes
router.get("/supplier-summary", protect, getSupplierCollections);
router.post("/remind", protect, sendReminder);

export default router;
