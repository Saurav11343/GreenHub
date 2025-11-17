import { z } from "zod";

export const uploadSchema = z.object({
  folder: z.string().min(1, "Folder name is required"),
  file: z
    .instanceof(File, { message: "File is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File must be less than 5MB",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    }),
});
