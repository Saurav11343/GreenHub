import { z } from "zod";

export const uploadSchema = z.object({
  file: z.any().refine((files) => files?.length > 0, "Image is required"),
});
