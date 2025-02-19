import express, { Request, Response, NextFunction } from "express";

const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
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
  getCourseById
};
