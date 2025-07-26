import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  availableQuantity: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("Inventory", inventorySchema);
