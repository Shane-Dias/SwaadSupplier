import express from "express";
import { addItem } from "../controllers/itemsController.js";
import { protectSupplier } from "../middleware/authMiddleware.js"; // for token validation

const router = express.Router();

router.post("/add", protectSupplier, addItem);

export default router;
