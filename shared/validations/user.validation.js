import { z } from "zod";

export const signupValidationSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 letters")
    .regex(/^[A-Za-z ]+$/, "First name can only contain letters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 letters")
    .regex(/^[A-Za-z ]+$/, "Last name can only contain letters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be minimum 6 charaters")
    .max(30, "Password can only be of 30 charaters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(
      /[@$!%*?&#]/,
      "Password must include at least one special character"
    ),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number")
    .optional(),
  address: z.string().max(200).optional(),
  profilePic: z.string().optional(),
  roleId: z.string().min(1, "Role is required"),
});

export const loginValidationSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
