import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  shopName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobileNo: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  
  role: {
    type: String,
    default: 'vendor'
  }
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;