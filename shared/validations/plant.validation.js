import { z } from "zod";

export const createPlantSchema = z.object({
  name: z
    .string()
    .min(2, "Plant name must be at least 2 characters")
    .regex(
      /^[A-Za-z0-9 ]+$/,
      "Plant name can only contain letters, number and spaces"
    ),
  categoryId: z.string().min(1, "Category ID is required"),
  price: z.number().positive("Price must be a positive number"),
  description: z.string().optional(),
  careInstructions: z.string().optional(),
  stockQty: z
    .number()
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative"),
  imageUrl: z.string().optional(),
});

export const updatePlantSchema = z.object({
  name: z
    .string()
    .min(2, "Plant name must be at least 2 characters")
    .regex(
      /^[A-Za-z0-9 ]+$/,
      "Plant name can only contain letters, number and spaces"
    )
    .optional(),
  categoryId: z.string().optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  description: z.string().optional(),
  careInstructions: z.string().optional(),
  stockQty: z
    .number()
    .int("Stock must be a whole number")
    .nonnegative("Stock cannot be negative")
    .optional(),
  imageUrl: z.string().optional(),
});

export const plantIdSchema = z.object({
  id: z.string().min(1, "Plant ID is required"),
});
