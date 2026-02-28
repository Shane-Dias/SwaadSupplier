import Order from "../models/orders.js";
import Vendor from "../models/vendor.js";
import Supplier from "../models/supplier.js";
import Item from "../models/item.js";
import jwt from "jsonwebtoken";
// Import sendEmail utility
import sendEmail from "../utils/sendEmail.js";

export const createOrder = async (req, res) => {
  try {
    const { supplierName, supplierId, items, totalAmount } = req.body;

    // 1. Extract vendor ID from JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    let vendorId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      vendorId = decoded.id;
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // 2. Validate vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // 3. Find supplier by ID or name
    let supplier;
    if (supplierId) {
      supplier = await Supplier.findById(supplierId);
    } else {
      supplier = await Supplier.findOne({
        shopName: { $regex: new RegExp(`^${supplierName}$`, "i") },
      });
    }

    if (!supplier) {
      console.log(`[Order Error] Supplier not found for Name: ${supplierName}, ID: ${supplierId}`);
      return res.status(404).json({
        message: 'Supplier not found',
        suggestion: 'Please check the supplier and try again'
      });
    }

    // 4. Validate items and check stock
    const itemValidations = await Promise.all(
      items.map(async (orderItem) => {
        const foundItem = await Item.findById(orderItem.item);
        if (!foundItem) {
          return { valid: false, reason: 'Item not found', itemId: orderItem.item };
        }
        if (foundItem.availableQuantity < orderItem.quantity) {
          return {
            valid: false,
            reason: `Insufficient stock for ${foundItem.name}. Available: ${foundItem.availableQuantity}`,
            itemId: orderItem.item
          };
        }
        return { valid: true, item: foundItem, orderQuantity: orderItem.quantity };
      })
    );

    const invalidItems = itemValidations.filter(v => !v.valid);
    if (invalidItems.length > 0) {
      return res.status(400).json({
        message: 'Order validation failed',
        details: invalidItems.map(i => i.reason)
      });
    }

    // 5. Create new order
    const order = new Order({
      vendor: vendorId,
      supplier: supplier._id,
      items: items.map((item) => ({
        item: item.item,
        quantity: item.quantity,
      })),
      totalAmount,
      status: "pending",
    });

    const savedOrder = await order.save();

    // 6. Update inventory (Deduct stock)
    await Promise.all(
      items.map(async (orderItem) => {
        await Item.findByIdAndUpdate(orderItem.item, {
          $inc: { availableQuantity: -orderItem.quantity }
        });
      })
    );

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: `Server Error: ${error.message}`,
      error: error.message,
      stack: error.stack
    });
  }
};

// Get orders for current vendor
export const getVendorOrders = async (req, res) => {
  try {
    // Extract vendor ID from JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    let vendorId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      vendorId = decoded.id;
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Fetch orders with populated supplier and items
    const orders = await Order.find({ vendor: vendorId })
      .populate({
        path: "supplier",
        select: "shopName location",
      })
      .populate({
        path: "items.item",
        select: "name category pricePerUnit unitType",
      })
      .sort({ orderedAt: -1 }); // Newest first

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Verify token and get vendor ID
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    let vendorId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      vendorId = decoded.id;
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Find and update order
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        vendor: vendorId,
        status: "pending", // Only pending orders can be cancelled
      },
      { status: "cancelled" },
      { new: true }
    )
      .populate("supplier", "shopName location")
      .populate("items.item", "name category pricePerUnit unitType");

    if (!order) {
      return res.status(404).json({
        message: "Order not found or cannot be cancelled",
      });
    }

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getSupplierOrders = async (req, res) => {
  try {
    const supplierId = req.user.id;

    const orders = await Order.find({ supplier: supplierId })
      .populate("vendor", "shopName")
      .populate("items.item", "name category pricePerUnit");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching supplier orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
};



export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "packed", "shipped", "out_for_delivery", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(orderId)
      .populate("vendor", "name email shopName")
      .populate("supplier", "name shopName")
      .populate("items.item", "name pricePerUnit");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    // Send email if status is delivered
    if (status === "delivered") {
      const emailSubject = `Order Delivered - Order #${order._id.toString().slice(-6).toUpperCase()}`;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">Order Delivered Successfully!</h2>
          <p>Dear ${order.vendor.name},</p>
          <p>Your order placed with <strong>${order.supplier.shopName}</strong> has been delivered.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-6).toUpperCase()}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">DELIVERED</span></p>
          </div>

          <p>You can download the invoice from your dashboard.</p>
          
          <p>Thank you for choosing SwaadSupplier!</p>
        </div>
      `;

      console.log(`[DEBUG] Order status is delivered. Preparing email for: ${order.vendor.email}`);

      if (!order.vendor.email) {
        console.error('[ERROR] Vendor email not found in order data');
      } else {
        const emailSent = await sendEmail({
          to: order.vendor.email,
          subject: `Order Delivered - ${order._id.toString().slice(-6).toUpperCase()}`,
          html: `
              <h2>Your Order is Delivered 🎉</h2>
              <p>Hello ${order.vendor.name},</p>
              <p>Your order has been delivered successfully by 
              <strong>${order.supplier.shopName}</strong>.</p>
  
              <p><b>Order ID:</b> ${order._id.toString().slice(-6).toUpperCase()}</p>
              <p><b>Total:</b> ₹${order.totalAmount}</p>

              <br/>
              <p>If you have any issues, reply to this email to contact the supplier.</p>
            `,
          replyTo: order.supplier.email // Reply-To set to Supplier
        });

        if (emailSent) {
          console.log(`✅ Delivery email successfully sent to ${order.vendor.email}`);
        } else {
          console.error(`❌ Failed to send delivery email to ${order.vendor.email}`);
        }
      }
    }

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
