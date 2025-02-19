import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "10 weeks"
    materials: [{ type: String }], // Array of file URLs
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);


export default Course;
