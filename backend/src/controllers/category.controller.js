import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "../../../shared/validations/category.validation.js";
import Category from "../models/Category.js";
import cloudinary from "../lib/cloudinary.js";
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
    // 1️⃣ Validate category ID
    const idValidation = categoryIdSchema.safeParse(req.params);
    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        errors: idValidation.error.flatten().fieldErrors,
      });
    }

    const { id } = idValidation.data;

    // 2️⃣ Validate body
    const bodyValidation = updateCategorySchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        errors: bodyValidation.error.flatten().fieldErrors,
      });
    }

    const updateData = bodyValidation.data;

    // 3️⃣ Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 4️⃣ Prevent duplicate names
    if (updateData.name) {
      const existing = await Category.findOne({ name: updateData.name });
      if (existing && existing._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "Another category already exists with this name",
        });
      }
    }

    // 5️⃣ If a new image is provided → delete old one from Cloudinary
    if (updateData.imageUrl && updateData.imageUrl !== category.imageUrl) {
      try {
        // Extract public_id from old image URL
        const urlParts = category.imageUrl.split("/");
        const fileName = urlParts.pop(); // example: abcd123.png
        const folder = urlParts.pop(); // example: categories

        const publicId = `${folder}/${fileName.split(".")[0]}`; // categories/abcd123

        // Delete old image
        const cloudRes = await cloudinary.uploader.destroy(publicId);

        if (cloudRes.result !== "ok" && cloudRes.result !== "not found") {
          console.log("Cloudinary deletion failed:", cloudRes);
        }
      } catch (err) {
        console.log("❌ Error deleting old image from Cloudinary:", err);
      }
    }

    // 6️⃣ Update category
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.log("❌ Error in updateCategory controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating category",
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

    let publicId = null;

    try {
      if (category.imageUrl) {
        const urlParts = category.imageUrl.split("/");
        const fileName = urlParts.pop(); // e.g. image123.jpg
        const folder = urlParts.pop(); // e.g. categories

        const nameWithoutExt = fileName.split(".")[0]; // image123
        publicId = `${folder}/${nameWithoutExt}`; // categories/image123
      }
    } catch (err) {
      console.log("❌ Failed to parse Cloudinary image URL:", err);
    }

    // 4️⃣ Delete image from Cloudinary
    if (publicId) {
      try {
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== "ok" && result.result !== "not found") {
          console.log("Cloudinary destroy error:", result);
          return res.status(500).json({
            success: false,
            message: "Failed to delete category image",
            cloudinary: result,
          });
        }
      } catch (cloudErr) {
        console.log("Cloudinary deletion exception:", cloudErr);
        return res.status(500).json({
          success: false,
          message: "image deletion failed",
        });
      }
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
