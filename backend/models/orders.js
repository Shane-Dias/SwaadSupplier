import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"],
    default: "pending",
  },
  orderedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
