import Plant from "../models/Plant.js";
import Category from "../models/Category.js";
import {
  createPlantSchema,
  plantIdSchema,
  updatePlantSchema,
} from "../../../shared/validations/plant.validation.js";
import { categoryIdSchema } from "../../../shared/validations/category.validation.js";

import cloudinary from "../lib/cloudinary.js";

export const createPlant = async (req, res) => {
  try {
    const validation = createPlantSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const {
      name,
      categoryId,
      price,
      description,
      careInstructions,
      stockQty,
      imageUrl,
    } = validation.data;

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const existingPlant = await Plant.findOne({ name });
    if (existingPlant) {
      return res.status(400).json({
        success: false,
        message: "A plant with this name already exists",
      });
    }

    const newPlant = await Plant.create({
      name,
      categoryId,
      price,
      description,
      careInstructions,
      stockQty,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Plant created successfully",
      data: newPlant,
    });
  } catch (error) {
    console.log("Error in createPlant plant.controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: plants.length,
      data: plants,
    });
  } catch (error) {
    console.log("Error in getAllPlants plant.controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPlantById = async (req, res) => {
  try {
    const validation = plantIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id } = validation.data;
    const plant = await Plant.findById(id).populate("categoryId", "name");
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: plant,
    });
  } catch (error) {
    console.log("Error in getPlantById plant.controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updatePlant = async (req, res) => {
  try {
    const idValidation = plantIdSchema.safeParse(req.params);
    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        errors: idValidation.error.flatten().fieldErrors,
      });
    }

    const { id } = idValidation.data;

    const bodyValidation = updatePlantSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        errors: bodyValidation.error.flatten().fieldErrors,
      });
    }

    const updateData = bodyValidation.data;

    const plant = await Plant.findById(id);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    if (updateData.name) {
      const existingPlant = await Plant.findOne({ name: updateData.name });
      if (existingPlant && existingPlant._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "Another plant already exists with this name",
        });
      }
    }

    if (updateData.categoryId) {
      const categoryExists = await Category.findById(updateData.categoryId);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }
    }

    if (updateData.imageUrl && updateData.imageUrl !== plant.imageUrl) {
      try {
        const urlParts = plant.imageUrl.split("/");
        const fileName = urlParts.pop();
        const folder = urlParts.pop();

        const publicId = `${folder}/${fileName.split(".")[0]}`;

        const cloudRes = await cloudinary.uploader.destroy(publicId);

        if (cloudRes.result !== "ok" && cloudRes.result !== "not found") {
          console.log("Cloudinary deletion failed:", cloudRes);
        }
      } catch (err) {
        console.log("Error deleting old image from Cloudinary:", err);
      }
    }

    const updatedPlant = await Plant.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedPlant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plant updated successfully",
      data: updatedPlant,
    });
  } catch (error) {
    console.log("Error in updatePlant plant.controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deletePlant = async (req, res) => {
  try {
    const validation = plantIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id } = validation.data;

    const plant = await Plant.findById(id);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    let publicId = null;
    if (plant.imageUrl) {
      try {
        const urlParts = plant.imageUrl.split("/");
        const fileWithExt = urlParts.pop();
        const folderName = urlParts.pop();
        const fileName = fileWithExt.split(".")[0];

        publicId = `${folderName}/${fileName}`;
      } catch (err) {
        console.log("Cloudinary URL parsing failed", err);
      }
    }

    if (publicId) {
      try {
        const cloudRes = await cloudinary.uploader.destroy(publicId);

        if (cloudRes.result !== "ok" && cloudRes.result !== "not found") {
          return res.status(500).json({
            success: false,
            message: "Failed to delete image from Cloudinary",
            cloudinary: cloudRes,
          });
        }
      } catch (err) {
        console.log("Cloudinary deletion error:", err);
        return res.status(500).json({
          success: false,
          message: "Cloudinary deletion failed",
        });
      }
    }

    await Plant.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Plant deleted successfully",
    });
  } catch (error) {
    console.log("Error in deletePlant plant.controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPlantByCategory = async (req, res) => {
  try {
    const validation = categoryIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id } = validation.data;

    const plants = await Plant.find({ categoryId: id }).populate(
      "categoryId",
      "name"
    );

    return res.status(200).json({
      success: true,
      total: plants.length,
      data: plants,
    });
  } catch (error) {
    console.log("Error in getPlantByCategory plant.controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCareInstructions = async (req, res) => {
  try {
    const { plantId } = req.params;
    const updates = req.body;

    const allowedKeys = [
      "watering",
      "sunlight",
      "soil",
      "temperature",
      "pestCare",
      "pruning",
      "repotting",
    ];

    const setObj = {};
    for (const key of allowedKeys) {
      if (updates[key] !== undefined) {
        setObj[`careInstructions.${key}`] = updates[key];
      }
    }

    if (Object.keys(setObj).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid care instruction fields provided",
      });
    }

    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    if (
      typeof plant.careInstructions !== "object" ||
      plant.careInstructions === null
    ) {
      plant.careInstructions = {};
      await plant.save();
    }

    const updatedPlant = await Plant.findByIdAndUpdate(
      plantId,
      { $set: setObj },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Care instructions updated successfully",
      data: updatedPlant.careInstructions,
    });
  } catch (error) {
    console.error("Error in updateCareInstructions plant.controller: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllPlantCareTips = async (req, res) => {
  try {
    const plants = await Plant.find(
      {},
      {
        name: 1,
        careInstructions: 1,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Plant care tips fetched successfully",
      total: plants.length,
      data: plants,
    });
  } catch (error) {
    console.error("Error in getAllPlantCareTips plant.controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPlantCareTipById = async (req, res) => {
  try {
    const { plantId } = req.params;

    const plant = await Plant.findById(plantId, {
      name: 1,
      careInstructions: 1,
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plant care tips fetched successfully",
      data: plant,
    });
  } catch (error) {
    console.error("Error in getPlantCareTipById plant.controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
