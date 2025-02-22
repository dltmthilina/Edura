import express, { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/httpError";
import Course from "../models/course";
import { toString } from "express-validator/lib/utils";
import { AuthRequest } from "../utils/common-interfaces";

const createCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid details", 400));
  }

  const { title, description, duration } = req.body;
  const userId = req.user?.userId;
  try {
    // Create a new course
    const newCourse = await Course.create({
      title,
      description,
      duration,
      tutorId: userId,
    });

    res.status(201).json({
      courseId: newCourse,
      message: "Course created succesfully",
    });
  } catch (err) {
    return next(new HttpError(toString(err), 500));
  }
};

//////////////////////////////////////////////////////////////
const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid details", 400));
  }

  const { id } = req.params;
  const { title, description, duration, materials } = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { title, description, duration, materials },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return next(new HttpError("Course not found", 404));
    }

    res.status(200).json({
      courseId: updatedCourse,
      message: "Course updated successfully",
    });
  } catch (error) {
    return next(new HttpError(toString(error), 500));
  }
};

/////////////////////////////////////////////////////////////////////////
const getCoursesByTutor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const tutorId = req.user?.userId;

  try {
    const courses = await Course.find({ tutorId });

    if (!courses || courses.length === 0) {
      return next(new HttpError("No courses found", 404));
    }

    res.status(200).json({ courses });
  } catch (error) {
    return next(new HttpError("Fetching courses failed", 500));
  }
};

///////////////////////////////////////////////////////////////////////////////
const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return next(new HttpError("Course not found", 404));
    }

    res.status(200).json({ course });
  } catch (error) {
    next(new HttpError("Could not retrieve course", 500));
  }
};

////////////////////////////////////////////////////////////////////
const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedCourse = await Course.findOneAndDelete({ _id: id });

    if (!deletedCourse) {
      return next(new HttpError("Course not found", 404));
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    return next(new HttpError("Could not delete course", 500));
  }
};

const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await Course.find();

    if (!courses || courses.length === 0) {
      return next(new HttpError("No courses found", 404));
    }

    res.status(200).json(courses);
  } catch (error) {
    return next(new HttpError(toString(error), 500));
  }
};

export default {
  createCourse,
  updateCourse,
  getCoursesByTutor,
  deleteCourse,
  getCourseById,
  getAllCourses,
};
