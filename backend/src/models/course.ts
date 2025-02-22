import mongoose, { Schema, Document } from "mongoose";

interface ICourse extends Document {
  title: string;
  description: string;
  duration: string;
  materials: string[];
  tutorId: mongoose.Types.ObjectId; // Reference to the course creator (User)
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "10 weeks"
    tutorId: { type: Schema.Types.ObjectId, ref: "", required: true }, // Reference to the user
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
