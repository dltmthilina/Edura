import express, { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/httpError";
import { Student } from "../models/student";

const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid details", 400));
  }
  const { sid } = req.params;
  const updateData = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(sid, updateData, {
      new: true,
    });
    if (!updatedStudent) {
      return next(new HttpError("Student not found", 404));
    }
    res.status(200).json(updatedStudent);
  } catch (err) {
    return next(new HttpError("Database error", 500));
  }
};

const getStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sid } = req.params;

  try {
    const student = await Student.findById(sid);

    if (!student) {
      return next(new HttpError("Student not found", 404));
    }

    res.status(200).json(student);
  } catch (error) {
    return next(new HttpError("Database error", 500));
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sid } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(sid);

    if (!deletedStudent) {
      return next(new HttpError("Student not found", 404));
    }

    res.status(200).json({ message: "Student deleted" });
  } catch (error) {
    return next(new HttpError("Database error", 500));
  }
};

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await Student.find(); // Fetch all students
    res.status(200).json(students);
  } catch (error) {
    return next(new HttpError("Database error", 500));
  }
};

export default {
  updateStudent,
  getStudentById,
  getAllStudents,
  deleteStudent,
};
