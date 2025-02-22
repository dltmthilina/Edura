import express, { Request, Response, NextFunction } from "express";
import { Enrollment } from "../models/enrollment";
import HttpError from "../models/httpError";
import { AuthRequest } from "../utils/common-interfaces";

const enrollStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.userId;
  const { courseId } = req.body;

  try {
    const existingEnrollment = await Enrollment.findOne({
      userId,
      courseId,
    });
    if (existingEnrollment) {
      return next(
        new HttpError("Student is already enrolled in this course", 400)
      );
    }

    const enrollment = await Enrollment.create({ userId, courseId });
    res.status(201).json(enrollment);
  } catch (error) {
    return next(new HttpError("Database error", 500));
  }
};

const unEnrollStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const { courseId } = req.body;

    const enrollment = await Enrollment.findOneAndDelete({ userId, courseId });

    if (!enrollment) {
      return next(new HttpError("Enrollment not found", 404));
    }

    res.status(200).json({ message: "Enrollment removed" });
  } catch (error) {
    return next(new HttpError("Database error", 500));
  }
};

const updateEnrollmentStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.userId;
  const { status, courseId } = req.body;

  try {
    const enrollment = await Enrollment.findOneAndUpdate(
      { userId, courseId },
      { status }
    );

    if (!enrollment) {
      return next(new HttpError("Enrollment not found", 404));
    }

    if (!["active", "completed"].includes(status)) {
      return next(new HttpError("Invalid status value", 400));
    }

    enrollment.status = status;
    await enrollment.save();

    res.status(200).json({ message: "Enrollment status updated", enrollment });
  } catch (error) {
    return next(new HttpError("Database error", 500));
  }
};

export default {
  enrollStudent,
  unEnrollStudent,
  updateEnrollmentStatus,
};
