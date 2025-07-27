import Item from "../models/item.js";
import Supplier from "../models/Supplier.js";

export const addItem = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const { name, category, unitType, pricePerUnit, availableQuantity } =
      req.body;

    const populatedItem = await Item.create({
      name,
      category,
      unitType,
      pricePerUnit,
      availableQuantity,
      supplier: supplierId,
    }).then((item) =>
      item.populate({
        path: "supplier",
        select: "name shopName email",
      })
    );

    res.status(201).json({
      message: "Item added successfully",
      item: populatedItem,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const getMyItems = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const items = await Item.find({ supplier: supplierId }).sort({
      createdAt: -1,
    });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllItemsWithSupplier = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("supplier", "shopName city") // 👈 only show selected fields
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items." });
    console.log(err);
  }
};
