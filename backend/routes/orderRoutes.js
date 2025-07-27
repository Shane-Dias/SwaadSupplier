import express from 'express';
import { createOrder,getVendorOrders,cancelOrder } from '../controllers/orderController.js';
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/vendor', getVendorOrders);
router.patch('/:orderId/cancel', cancelOrder)
export default router;