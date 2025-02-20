import express, { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import courseController from "../../controllers/courseController";
import HttpError from "../../models/httpError";
import Course from "../../models/course";

const { createCourse } = courseController;

jest.mock("express-validator");
jest.mock("../../models/course");

describe("Course create controller test", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        title: "Introduction to Node.js",
        description: "A beginner-friendly Node.js course",
        duration: "6 weeks",
        materials: ["https://example.com/nodejs.pdf"],
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 400 for invalid details", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue([{ msg: "Invalid input" }]),
    });
    await createCourse(req, res, next);
    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(400);
    expect(actualError.message).toBe("Invalid details");
  });

  it("should return 201 for course create successful", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    });

    const mockCourse = new Course({
      title: "Introduction to Node.js",
      description: "A beginner-friendly Node.js course",
      duration: "6 weeks",
      materials: ["https://example.com/nodejs.pdf"],
    });

    const mockCreate = jest.fn().mockResolvedValue(mockCourse);
    Course.create = mockCreate;
    await createCourse(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      courseId: mockCourse._id,
      message: "Course created succesfully",
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should return 500 for database errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    });

    const mockCreate = jest.fn().mockRejectedValue(new Error("Database error"));
    Course.create = mockCreate;
    await createCourse(req, res, next);
    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
  });
});
