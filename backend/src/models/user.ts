import { Model } from "mongoose";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: ["student", "tutor"], default: ["student"] },
    activeRole: {
      type: String,
      enum: ["student", "tutor"],
      default: "student",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (!this.roles.includes(this.activeRole)) {
    this.activeRole = this.roles[0] as "student" | "tutor"; // Default to first available role
  }
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
