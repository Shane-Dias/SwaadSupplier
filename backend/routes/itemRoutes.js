import express from "express";
import { addItem, getMyItems  } from "../controllers/itemsController.js";
import { protectSupplier } from "../middleware/authMiddleware.js"; // for token validation

const router = express.Router();

router.post("/add", protectSupplier, addItem);
router.get("/my", protectSupplier, getMyItems);

export default router;
