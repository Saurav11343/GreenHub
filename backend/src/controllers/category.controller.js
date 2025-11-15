import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "../../../shared/validations/category.validation.js";
import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const validation = createCategorySchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { name, description, imageUrl } = validation.data;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = await Category.create({
      name,
      description,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.log("Error in createCategory controller: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: categories.length,
      data: categories,
    });
  } catch (error) {
    console.log("Error in getAllCategory controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const validation = categoryIdSchema.safeParse(req.params);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id } = validation.data;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.log("Error in getCategoryById controller: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const idValidation = categoryIdSchema.safeParse(req.params);

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        errors: idValidation.error.flatten().fieldErrors,
      });
    }

    const { id } = idValidation.data;

    const bodyValidation = updateCategorySchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        errors: bodyValidation.error.flatten().fieldErrors,
      });
    }

    const updateData = bodyValidation.data;
    if (updateData.name) {
      const existing = await Category.findOne({ name: updateData.name });

      if (existing && existing._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "Another category already exists with this name",
        });
      }
    }

    const updateCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updateCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updateCategory,
    });
  } catch (error) {
    console.log("Error in updateCategory controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const validation = categoryIdSchema.safeParse(req.params);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.flatten().fieldErrors,
      });
    }

    const { id } = validation.data;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not Found",
      });
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteCategory controller: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
