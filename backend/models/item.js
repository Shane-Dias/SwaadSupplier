import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "vegetables",
        "spices",
        "fruits",
        "dairy",
        "meat",
        "oils",
        "grains",
      ],
    },
    unitType: {
      type: String,
      enum: ["kg", "litre", "piece","dozen","gram","ml"],
      default: "kg",
    },
    pricePerUnit: { type: Number, required: true },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier", // String reference only
      required: true,
    },
    availableQuantity: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
