import express, { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/httpError";
import Course from "../models/course";
import { toString } from "express-validator/lib/utils";

const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid details", 400));
  }

  const { title, description, duration, materials } = req.body;
  try {
    // Create a new course
    const newCourse = await Course.create({
      title,
      description,
      duration,
      materials,
    });

    res.status(201).json({
      courseId: newCourse._id,
      message: "Course created succesfully",
    });
  } catch (err) {
    return next(new HttpError(toString(err), 500));
  }
};
const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
const getCoursesByAdminId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export default {
  createCourse,
  updateCourse,
  getCoursesByAdminId,
  deleteCourse,
  getCourseById,
};
