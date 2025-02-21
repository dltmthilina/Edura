import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dob: { type: Date },
    address: { type: String },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
