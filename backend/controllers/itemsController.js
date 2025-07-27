import Item from "../models/item.js";

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

export const deleteItem = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const itemId = req.params.id;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    console.log("Item Supplier:", item.supplier.toString());
    console.log("Logged-in Supplier:", supplierId);

    if (item.supplier.toString() !== supplierId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this item" });
    }

    await item.deleteOne();

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
    console.log(err);
  }
};

export const updateItem = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const itemId = req.params.id;
    const updates = req.body;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.supplier.toString() !== supplierId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this item" });
    }

    // Update fields
    Object.keys(updates).forEach((key) => {
      item[key] = updates[key];
    });

    await item.save();

    res.status(200).json({
      message: "Item updated successfully",
      item,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
    console.log(err);
  }
};
