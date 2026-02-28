import Review from "../models/Review.js";
import Order from "../models/orders.js";
import Supplier from "../models/supplier.js";

// Get Platform Stats for Trust Dashboard
export const getPlatformStats = async (req, res) => {
    try {
        // 1. Total Verified Suppliers
        const totalSuppliers = await Supplier.countDocuments({ isVerified: true });

        // 2. Total Delivered Orders
        const totalDelivered = await Order.countDocuments({ status: "delivered" });

        // 3. Average Rating across all reviews
        const ratingStats = await Review.aggregate([
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                    // Bonus: Breakdown calculations could go here or separate aggregation
                }
            }
        ]);
        const avgPlatformRating = ratingStats.length > 0 ? ratingStats[0].avgRating.toFixed(1) : "0.0";

        // Bonus: Rating Breakdown
        const breakdown = await Review.aggregate([
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format breakdown: { 5: 10, 4: 5, ... }
        const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalReviews = 0;
        breakdown.forEach(item => {
            ratingBreakdown[item._id] = item.count;
            totalReviews += item.count;
        });

        // 4. Top Supplier (Highest Rating with reviewCount > 0)
        const topSupplier = await Supplier.findOne({ isVerified: true, reviewCount: { $gt: 0 } })
            .sort({ rating: -1, reviewCount: -1 })
            .select("shopName rating reviewCount");

        res.status(200).json({
            totalSuppliers,
            totalDelivered,
            avgPlatformRating: parseFloat(avgPlatformRating),
            onTimePercentage: 98, // Mocked until we track delivery times
            topSupplier: topSupplier || { shopName: "No Top Supplier Yet", rating: 0, reviewCount: 0 },
            ratingBreakdown,
            totalReviews
        });

    } catch (error) {
        console.error("Get Stats Error:", error);
        res.status(500).json({ message: "Server error fetching stats" });
    }
};

// Get Top 5 Suppliers Leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const topSuppliers = await Supplier.find({ isVerified: true, reviewCount: { $gt: 0 } })
            .sort({ rating: -1, reviewCount: -1 })
            .limit(5)
            .select("shopName rating reviewCount");

        res.status(200).json(topSuppliers);
    } catch (error) {
        console.error("Get Leaderboard Error:", error);
        res.status(500).json({ message: "Server error fetching leaderboard" });
    }
};
