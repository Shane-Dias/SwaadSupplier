import express from "express";
import { addReview, getAllReviews, getSupplierReviews } from "../controllers/reviewController.js";
import { getPlatformStats, getLeaderboard } from "../controllers/trustController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addReview);
router.get("/all", getAllReviews);
router.get("/stats", getPlatformStats);
router.get("/leaderboard", getLeaderboard); // Leaderboard endpoint
router.get("/:supplierId", getSupplierReviews);

export default router;
