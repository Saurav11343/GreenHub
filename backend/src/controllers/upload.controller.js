import cloudinary from "../lib/cloudinary.js";
import { uploadSchema } from "../../../shared/validations/upload.validation.js";

export const uploadImage = async (req, res) => {
  try {
    // Validate folder name using Zod
    const validation = uploadSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { folder } = validation.data;

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    // Upload function wrapped in a Promise
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    // Upload image
    const uploaded = await uploadToCloudinary();

    return res.status(200).json({
      success: true,
      imageUrl: uploaded.secure_url, // ⬅ Only return URL
    });
  } catch (error) {
    console.error("IMAGE UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};
