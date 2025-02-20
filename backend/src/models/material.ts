import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    fileType: {
      type: String,
      enum: ["pdf", "doc", "video", "image"],
      required: true,
    },
    fileUrl: { type: String, required: true }, // Store the file URL (e.g., AWS S3, Firebase, Cloudinary)
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Material = mongoose.model("Material", materialSchema);
