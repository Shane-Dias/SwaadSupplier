import Order from "../models/orders.js";
import Vendor from "../models/vendor.js";
import Supplier from "../models/supplier.js";

// --- Vendor Side ---

export const getVendorCreditStats = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const vendor = await Vendor.findById(vendorId);

        if (!vendor) return res.status(404).json({ message: "Vendor not found" });

        // Calculate Total Due
        const unpaidOrders = await Order.find({
            vendor: vendorId,
            paymentStatus: { $in: ["unpaid", "overdue"] }
        }).populate("supplier", "shopName");

        const totalDue = unpaidOrders.reduce((acc, order) => acc + order.totalAmount, 0);

        // Get recent transactions (Orders)
        const transactions = await Order.find({ vendor: vendorId })
            .sort({ orderedAt: -1 })
            .limit(10)
            .populate("supplier", "shopName");

        res.json({
            trustScore: vendor.trustScore || 500,
            creditLimit: vendor.creditLimit || 20000,
            totalDue,
            transactions: transactions.map(t => ({
                id: t._id,
                supplier: t.supplier?.shopName || "Unknown",
                date: t.orderedAt,
                amount: t.totalAmount,
                status: t.paymentStatus === 'unpaid' ? 'Due' : t.paymentStatus === 'paid' ? 'Paid' : 'Overdue',
                items: `${t.items.length} Items`,
                dueDate: t.dueDate || new Date(new Date(t.orderedAt).getTime() + 7 * 24 * 60 * 60 * 1000) // Mock due date +7 days
            }))
        });

    } catch (error) {
        console.error("Credit Stats Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const payBill = async (req, res) => {
    try {
        const { orderId } = req.body;
        const vendorId = req.user.id;

        const order = await Order.findOneAndUpdate(
            { _id: orderId, vendor: vendorId },
            { paymentStatus: "paid" },
            { new: true }
        );

        if (!order) return res.status(404).json({ message: "Order not found" });

        // Improve Trust Score
        await Vendor.findByIdAndUpdate(vendorId, { $inc: { trustScore: 10 } });

        res.json({ message: "Payment Successful", order });

    } catch (error) {
        res.status(500).json({ message: "Payment Failed" });
    }
};

// --- Supplier Side ---

export const getSupplierCollections = async (req, res) => {
    try {
        const supplierId = req.user.id;

        // Find all unpaid orders for this supplier
        const unpaidOrders = await Order.find({
            supplier: supplierId,
            paymentStatus: { $in: ["unpaid", "overdue"] }
        }).populate("vendor", "shopName mobileNo trustScore");

        const totalReceivables = unpaidOrders.reduce((acc, o) => acc + o.totalAmount, 0);

        // Group debts by vendor
        const vendorMap = {};
        unpaidOrders.forEach(order => {
            const vid = order.vendor._id.toString();
            if (!vendorMap[vid]) {
                vendorMap[vid] = {
                    id: vid,
                    name: order.vendor.shopName,
                    trustScore: order.vendor.trustScore,
                    phone: order.vendor.mobileNo,
                    due: 0,
                    lastPaid: "N/A", // Mock
                    status: 'Due'
                };
            }
            vendorMap[vid].due += order.totalAmount;
            if (order.paymentStatus === 'overdue') vendorMap[vid].status = 'Overdue';
        });

        res.json({
            totalReceivables,
            activeVendors: Object.keys(vendorMap).length,
            vendorDebts: Object.values(vendorMap)
        });

    } catch (error) {
        console.error("Supplier Collection Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const sendReminder = async (req, res) => {
    // Mock Reminder
    res.json({ message: "Reminder Sent Successfully" });
};
