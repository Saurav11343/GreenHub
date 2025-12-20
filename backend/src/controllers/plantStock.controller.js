import Plant from "../models/Plant.js";

/* --------------------------------------------------
   STOCK SUMMARY (already implemented)
-------------------------------------------------- */
export const getPlantStockSummary = async (req, res) => {
  try {
    const totalPlants = await Plant.countDocuments();

    const outOfStock = await Plant.countDocuments({ stockQty: 0 });

    const lowStock = await Plant.countDocuments({
      stockQty: { $gt: 0, $lte: 5 },
    });

    const inStock = await Plant.countDocuments({
      stockQty: { $gt: 5 },
    });

    // 🔹 TOTAL INVENTORY (sum of all stockQty)
    const inventoryAgg = await Plant.aggregate([
      {
        $group: {
          _id: null,
          totalInventory: { $sum: "$stockQty" },
        },
      },
    ]);

    const totalInventory = inventoryAgg[0]?.totalInventory || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalPlants, // number of plant records
        totalInventory, // ✅ total units in inventory
        inStock,
        lowStock,
        outOfStock,
      },
    });
  } catch (error) {
    console.error("Stock summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch plant stock summary",
    });
  }
};

/* --------------------------------------------------
   GET ALL PLANT STOCK (Admin Management)
-------------------------------------------------- */
export const getAllPlantStock = async (req, res) => {
  try {
    const plants = await Plant.find()
      .populate("categoryId", "name")
      .select("name price stockQty imageUrl categoryId createdAt");

    return res.status(200).json({
      success: true,
      total: plants.length,
      data: plants,
    });
  } catch (error) {
    console.error("Get all stock error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch plant stock list",
    });
  }
};

/* --------------------------------------------------
   GET LOW STOCK PLANTS (Optional)
-------------------------------------------------- */
export const getLowStockPlants = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    // Include out-of-stock (0) + low stock (<= threshold)
    const plants = await Plant.find({
      stockQty: { $lte: threshold },
    })
      .populate("categoryId", "name")
      .select("name price stockQty imageUrl categoryId");

    return res.status(200).json({
      success: true,
      total: plants.length,
      data: plants,
    });
  } catch (error) {
    console.error("Low stock error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch low stock plants",
    });
  }
};

/* --------------------------------------------------
   UPDATE PLANT STOCK
-------------------------------------------------- */
export const updatePlantStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockQty } = req.body;

    if (stockQty === undefined || stockQty < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid stock quantity",
      });
    }

    const plant = await Plant.findById(id);

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    plant.stockQty += Number(stockQty);
    await plant.save();

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: {
        id: plant._id,
        stockQty: plant.stockQty,
      },
    });
  } catch (error) {
    console.error("Update stock error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update plant stock",
    });
  }
};
