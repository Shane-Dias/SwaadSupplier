import express from "express";
import { addItem, getMyItems,getAllItemsWithSupplier, deleteItem, updateItem } from "../controllers/itemsController.js";
import { protectSupplier } from "../middleware/authMiddleware.js"; // for token validation

const router = express.Router();

router.post("/add", protectSupplier, addItem);
router.get("/my", protectSupplier, getMyItems);
router.get("/all", getAllItemsWithSupplier);
router.delete("/:id",protectSupplier,  deleteItem);
router.put("/:id", protectSupplier, updateItem);

export default router;
