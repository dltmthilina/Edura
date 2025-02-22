import express, { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/httpError";
import { toString } from "express-validator/lib/utils";
import User from "../models/user";

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid details", 400));
  }
  const { uid } = req.params;
  const { firstName, lastName, email, roles } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      uid,
      { firstName, lastName, email, roles },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return next(new HttpError("User not found", 404));
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    return next(new HttpError(toString(err), 500));
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { uid } = req.params;

  try {
    const user = await User.findById(uid);

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(" error", 500));
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { uid } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(uid);

    if (!deletedUser) {
      return next(new HttpError("User not found", 404));
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return next(new HttpError(toString(error), 500));
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    if (!users) {
      return next(new HttpError("User not found", 404));
    }
    res.status(200).json(users);
  } catch (error) {
    return next(new HttpError("errr", 500));
  }
};

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await User.find({ roles: "student" }); // Find users where "student" exists in roles array
    if (!students) {
      return next(new HttpError("Students not found", 404));
    }
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllTutors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tutors = await User.find({ roles: "tutor" }); // Find users where "student" exists in roles array
    if (!tutors) {
      return next(new HttpError("Tutors not found", 404));
    }
    res.status(200).json(tutors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export default {
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  getAllStudents,
  getAllTutors,
};
