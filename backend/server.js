import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// import supplierRoutes from './routes/supplierRoutes.js';
// import vendorRoutes from './routes/vendorRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
// app.use('/api/suppliers', supplierRoutes);
// app.use('/api/vendors', vendorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
