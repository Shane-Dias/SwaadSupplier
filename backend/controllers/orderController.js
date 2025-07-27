import Order from '../models/orders.js';
import Vendor from '../models/vendor.js';
import Supplier from '../models/supplier.js';
import Item from '../models/item.js';
import jwt from 'jsonwebtoken';

export const createOrder = async (req, res) => {
  try {
    const { supplierName, items, totalAmount } = req.body;

    // 1. Extract vendor ID from JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    let vendorId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      vendorId = decoded.id; // Assuming your JWT payload has userId field
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // 2. Validate vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // 3. Find supplier by name (case-insensitive)
    const supplier = await Supplier.findOne({ 
      shopName: { $regex: new RegExp(`^${supplierName}$`, 'i') }
    });
    
    // if (!supplier) {
    //   return res.status(404).json({ 
    //     message: 'Supplier not found',
    //     suggestion: 'Please check the supplier name and try again'
    //   });
    // }

    // 4. Validate items
    const itemValidations = await Promise.all(
      items.map(async (item) => {
        const foundItem = await Item.findById(item.item);
        if (!foundItem) {
          return { valid: false, itemId: item.item };
        }
        return { valid: true, item: foundItem };
      })
    );

    // const invalidItems = itemValidations.filter(v => !v.valid);
    // if (invalidItems.length > 0) {
    //   return res.status(400).json({ 
    //     message: 'Some items not found',
    //     invalidItems: invalidItems.map(i => i.itemId)
    //   });
    // }

    // 5. Create new order
    const order = new Order({
      vendor: vendorId,
      supplier: supplier._id, // Use the found supplier's ID
      items: items.map(item => ({
        item: item.item,
        quantity: item.quantity
      })),
      totalAmount,
      status: 'pending'
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};