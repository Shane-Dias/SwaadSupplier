import Review from "../models/Review.js";
import Order from "../models/orders.js";
import Supplier from "../models/supplier.js";

// Add a new review
export const addReview = async (req, res) => {
    try {
        const { orderId, rating, comment, image } = req.body;
        const vendorId = req.user.id; // From auth middleware

        // 1. Validate Order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // 2. Check if user is the actual vendor of this order
        if (order.vendor.toString() !== vendorId) {
            return res.status(403).json({ message: "Unauthorized to review this order" });
        }

        // 3. Check if Order is Delivered
        if (order.status !== "delivered") {
            return res.status(400).json({ message: "Can only review delivered orders" });
        }

        // 4. Check for duplicate review
        const existingReview = await Review.findOne({ order: orderId });
        if (existingReview) {
            return res.status(400).json({ message: "Review already submitted for this order" });
        }

        // 5. Create Review
        const newReview = new Review({
            reviewer: vendorId,
            supplier: order.supplier,
            order: orderId,
            rating,
            comment,
            image,
            isVerified: true, // Auto-verified since it's linked to a delivered order
        });

        await newReview.save();

        // 6. Update Supplier's Average Rating
        const result = await Review.aggregate([
            { $match: { supplier: order.supplier } },
            {
                $group: {
                    _id: "$supplier",
                    avgRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (result.length > 0) {
            await Supplier.findByIdAndUpdate(order.supplier, {
                rating: result[0].avgRating.toFixed(1), // Store as 4.5
                reviewCount: result[0].totalReviews
            });
        }

        res.status(201).json({ message: "Review added successfully", review: newReview });

    } catch (error) {
        console.error("Add Review Error:", error);
        res.status(500).json({ message: "Server error adding review" });
    }
};

// Get all reviews (for Community Feed)
// Get all reviews (for Community Feed) with Pagination
export const getAllReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const totalReviews = await Review.countDocuments();

        const reviews = await Review.find()
            .populate("reviewer", "name shopName") // Get vendor name
            .populate("supplier", "name shopName") // Get supplier name
            .sort({ createdAt: -1 }) // Newest first
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            reviews,
            currentPage: page,
            totalPages: Math.ceil(totalReviews / limit),
            totalReviews
        });
    } catch (error) {
        console.error("Get Reviews Error:", error);
        res.status(500).json({ message: "Server error fetching reviews" });
    }
};

// Get reviews for a specific supplier
export const getSupplierReviews = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const reviews = await Review.find({ supplier: supplierId })
            .populate("reviewer", "name shopName")
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Get Supplier Reviews Error:", error);
        res.status(500).json({ message: "Server error fetching supplier reviews" });
    }
};


