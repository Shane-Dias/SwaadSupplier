import Item from "../models/item.js";

export const addItem = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const { name, category, unitType, pricePerUnit,availableQuantity  } = req.body;

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
