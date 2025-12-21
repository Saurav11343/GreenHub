import CartItem from "../models/CartItem.js";
import User from "../models/User.js";
import Plant from "../models/Plant.js";
import {
  createCartItemSchema,
  updateCartItemSchema,
  cartItemIdSchema,
  userIdSchema,
} from "../../../shared/validations/cartItem.validation.js";

export const addToCart = async (req, res) => {
  try {
    const validation = createCartItemSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { userId, plantId, quantity = 1 } = validation.data;

    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const plantExist = await Plant.findById(plantId);
    if (!plantExist) {
      return res.status(400).json({
        success: false,
        message: "Plant not found",
      });
    }

    const existingItem = await CartItem.findOne({ userId, plantId });

    const finalQty = existingItem ? existingItem.quantity + quantity : quantity;

    if (finalQty > plantExist.stockQty) {
      return res.status(400).json({
        success: false,
        message: `Only ${plantExist.stockQty} items available in stock`,
      });
    }

    if (existingItem) {
      existingItem.quantity = finalQty;

      const updatedItem = await existingItem.save();
      return res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        data: updatedItem,
      });
    }

    const newItem = await CartItem.create({
      userId,
      plantId,
      quantity: finalQty,
    });

    return res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: newItem,
    });
  } catch (error) {
    console.log("Error in addToCart cartitem.controller :", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const validation = cartItemIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }
    const { id: userId } = validation.data;

    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const cartItem = await CartItem.find({ userId })
      .populate("plantId", "name price imageUrl stockQty")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: cartItem.length,
      data: cartItem,
    });
  } catch (error) {
    console.log("Error in getUserCart cartItem.controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const idValidation = cartItemIdSchema.safeParse(req.params);
    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        errors: idValidation.error.flatten().fieldErrors,
      });
    }

    const { id } = idValidation.data;

    const bodyValidation = updateCartItemSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        errors: bodyValidation.error.flatten().fieldErrors,
      });
    }

    const { quantity } = bodyValidation.data;

    const cartItem = await CartItem.findById(id);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const plant = await Plant.findById(cartItem.plantId);
    if (!plant) {
      return res.status(400).json({
        success: false,
        message: "Plant not found",
      });
    }

    if (quantity > plant.stockQty) {
      return res.status(400).json({
        success: false,
        message: `Only ${plant.stockQty} items available in stock`,
      });
    }

    if (quantity <= 0) {
      await CartItem.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "Cart item removed successfully",
      });
    }

    cartItem.quantity = quantity;
    const updatedItem = await cartItem.save();

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.log("Error in updateCartItem cartItem.controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const validation = cartItemIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id } = validation.data;

    const cartItem = await CartItem.findByIdAndDelete(id);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
      data: cartItem,
    });
  } catch (error) {
    console.log("Error in deleteCartItem controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const validation = userIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id: userId } = validation.data;

    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await CartItem.deleteMany({ userId });

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.log("Error in clearCart cartItem.controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
