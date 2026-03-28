import { z } from "zod";

export const createCartItemSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  plantId: z.string().min(1, "Plant ID is required"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

export const cartItemIdSchema = z.object({
  id: z.string().min(1, "Cart Item ID is required"),
});

export const userIdSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});
