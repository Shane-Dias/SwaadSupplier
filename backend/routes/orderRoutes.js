import express from 'express';
import { createOrder,getVendorOrders,cancelOrder,getSupplierOrders,updateOrderStatus  } from '../controllers/orderController.js';
import { protectSupplier } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/vendor', getVendorOrders);
router.patch('/:orderId/cancel', cancelOrder);
router.get("/supplier", protectSupplier, getSupplierOrders);
router.put("/supplier/update-status/:orderId", protectSupplier, updateOrderStatus);


export default router;