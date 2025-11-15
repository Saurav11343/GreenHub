import { z } from "zod";

export const createOrderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  totalAmount: z.coerce.number().positive("Total amount must be positive"),
  shippingAddress: z
    .string()
    .min(5, "Shipping address  must be at least 5 characters"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["Pending", "Shipped", "Delivered", "Cancelled"], {
    message: "Invalid order status",
  }),
});

export const orderIdSchema = z.object({
  id: z.string().min(1, "Order ID is required"),
});

export const userIdSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});
