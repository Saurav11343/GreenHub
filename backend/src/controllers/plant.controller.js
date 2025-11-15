import Plant from "../models/Plant.js";
import Category from "../models/Category.js";
import {
  createPlantSchema,
  plantIdSchema,
  updatePlantSchema,
} from "../../../shared/validations/plant.validation.js";
import { categoryIdSchema } from "../../../shared/validations/category.validation.js";

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
    console.log("Error in createPlant controller:", error);
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
    console.log("Error in getAllPlants controller:", error);
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
    console.log("Error in getPlantById controller:", error);
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
    console.log("Error in updatePlant controller:", error);
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
      return req.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }
    const { id } = validation.data;

    const deletePlant = await Plant.findByIdAndDelete(id);
    if (!deletePlant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Plant deleted successfully",
    });
  } catch (error) {
    console.log("Error in deletePlant controller:".error);
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
    console.log("Error in getPlantByCategory controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
