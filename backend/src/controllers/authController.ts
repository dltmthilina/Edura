import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import HttpError from "../models/httpError";
import { toString } from "express-validator/lib/utils";
import User from "../models/user";
import { Student } from "../models/student";
import { Tutor } from "../models/tutor";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config({ path: ".env.local" });

const register = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid user data", 400));
  }

  try {
    const { firstName, lastName, email, studentId, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    if (role == "student") {
      await Student.create({
        userId: user._id,
        studentId,
      });
    } else if (role == "tutor") {
      await Tutor.create({
        userId: user._id,
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(201)
      .json({ token: token, message: "User registered successfully!" });
  } catch (error) {
    return next(new HttpError(toString(error), 500));
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      next(new HttpError("Invalid credentials", 401));
    }
    const token = jwt.sign(
      { userId: user?._id, role: user?.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, message: "User login successfully!" });
  } catch (error) {
    next(new HttpError(toString(error), 500));
  }
};

export default {
  login,
  register,
};
