import { Model } from "mongoose";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], require: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
