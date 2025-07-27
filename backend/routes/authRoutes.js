import express from 'express';
import {
  registerVendor,
  registerSupplier,
  login,
  getUserData
} from '../controllers/authController.js';
import upload from '../middleware/uploadMiddleware.js'; // For file uploads

const router = express.Router();

router.post('/register/vendor', registerVendor);
router.post('/register/supplier', upload.single('fssaiCertificate'), registerSupplier);
router.post('/login', login);
router.get('/me',getUserData);

export default router;