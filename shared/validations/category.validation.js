import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .regex(/^[A-Za-z ]+$/, "Category name should contain only letters"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .regex(/^[A-Za-z ]+$/, "Category name should contain only letters")
    .optional(),

  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const categoryIdSchema = z.object({
  id: z.string().min(1, "Category ID is required"),
});
