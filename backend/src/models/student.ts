import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentID: { type: String, unique: true, required: true },
    dob: { type: Date },
    address: { type: String },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
