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

    // 1️⃣ Validate user
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Validate plant
    const plantExist = await Plant.findById(plantId);
    if (!plantExist) {
      return res.status(400).json({
        success: false,
        message: "Plant not found",
      });
    }

    // 3️⃣ Check existing cart item
    const existingItem = await CartItem.findOne({ userId, plantId });

    // Calculate final quantity user wants in cart
    const finalQty = existingItem ? existingItem.quantity + quantity : quantity;

    // 4️⃣ Validate stock (DO NOT DEDUCT)
    if (finalQty > plantExist.stockQty) {
      return res.status(400).json({
        success: false,
        message: `Only ${plantExist.stockQty} items available in stock`,
      });
    }

    // 5️⃣ Update existing cart item
    if (existingItem) {
      existingItem.quantity = finalQty;

      const updatedItem = await existingItem.save();
      return res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        data: updatedItem,
      });
    }

    // 6️⃣ Create new cart item
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
    console.log("Error in addToCart controller:", error);
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
    console.log("Error in getUserCart controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    // 1️⃣ Validate cart item id
    const idValidation = cartItemIdSchema.safeParse(req.params);
    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        errors: idValidation.error.flatten().fieldErrors,
      });
    }

    const { id } = idValidation.data;

    // 2️⃣ Validate body
    const bodyValidation = updateCartItemSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        errors: bodyValidation.error.flatten().fieldErrors,
      });
    }

    const { quantity } = bodyValidation.data;

    // 3️⃣ Fetch cart item
    const cartItem = await CartItem.findById(id);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // 4️⃣ Fetch plant for stock validation
    const plant = await Plant.findById(cartItem.plantId);
    if (!plant) {
      return res.status(400).json({
        success: false,
        message: "Plant not found",
      });
    }

    // 5️⃣ Validate stock (NO deduction)
    if (quantity > plant.stockQty) {
      return res.status(400).json({
        success: false,
        message: `Only ${plant.stockQty} items available in stock`,
      });
    }

    // Optional: if quantity is 0, remove item
    if (quantity <= 0) {
      await CartItem.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "Cart item removed successfully",
      });
    }

    // 6️⃣ Update cart quantity
    cartItem.quantity = quantity;
    const updatedItem = await cartItem.save();

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.log("Error in updateCartItem controller:", error);
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
    console.log("Error in clearCart controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
