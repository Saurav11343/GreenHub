import cloudinary from "../lib/cloudinary.js";
import sharp from "sharp";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const folderName = req.body.folderName || "default_folder";

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // 1️⃣ Resize + compress using Sharp
    const resizedImageBuffer = await sharp(file.buffer)
      .resize(800, 800, {
        fit: "cover", // crop to fill — BEST for profile/category images
      })
      .jpeg({ quality: 85 }) // compress but keep good quality
      .toBuffer();

    // 2️⃣ Upload resized buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: folderName }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(resizedImageBuffer);
    });

    return res.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (err) {
    console.log("❌ Cloudinary Upload Error:", err);
    return res.status(500).json({
      success: false,
      message: "Upload failed due to server error",
    });
  }
};
