import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { 
            type: String, 
            enum: ["vegetables", "spices", "fruits", "dairy", "meat"], 
        },
        unitType: { 
            type: String, 
            enum: ["kg", "litre", "piece"], 
            default: "kg" 
        },
        pricePerUnit: { type: Number, required: true },
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
