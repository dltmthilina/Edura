import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    qualification: [{ type: String }],
  },
  { timestamps: true }
);

export const Tutor = mongoose.model("Tutor", tutorSchema);
