import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    careInstructions: {
      watering: { type: String, default: "" },
      sunlight: { type: String, default: "" },
      soil: { type: String, default: "" },
      temperature: { type: String, default: "" },
      pestCare: { type: String, default: "" },
      pruning: { type: String, default: "" },
      repotting: { type: String, default: "" },
    },
    stockQty: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;
