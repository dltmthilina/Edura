import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "Active",
    },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
