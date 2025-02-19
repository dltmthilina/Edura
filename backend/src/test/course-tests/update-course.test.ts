import express, { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import courseController from "../../controllers/courseController";
import HttpError from "../../models/httpError";
import Course from "../../models/course";

jest.mock("express-validator");
jest.mock("../../models/course");

describe("Course update controller test", () => {
  let req: any, res: any, next: jest.Mock;
  const { updateCourse } = courseController;

  beforeEach(() => {
    req = {
      params: { id: "courseId123" },
      body: {
        title: "Updated Course Title",
        description: "Updated description",
        duration: "8 weeks",
        materials: ["https://example.com/updated.pdf"],
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 400 for invalid input", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue([{ msg: "Invalid input" }]),
    });
    await updateCourse(req, res, next);
    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(400);
    expect(actualError.message).toBe("Invalid details");
  });

  it("should return 404 for non-existing course", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    });

    Course.findById = jest.fn().mockResolvedValue(null);
    await updateCourse(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(404);
    expect(actualError.message).toBe("Course not found");
  });

  it("should return 200 for successful course update", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    });

    const mockCourse = new Course({
      _id: "courseId123",
      title: "Updated Course Title",
      description: "Updated description",
      duration: "8 weeks",
      materials: ["https://example.com/updated.pdf"],
    });

    Course.findByIdAndUpdate = jest.fn().mockResolvedValue(mockCourse);
    await updateCourse(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      courseId: mockCourse._id,
      message: "Course updated successfully",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 500 for database errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    });

    Course.findByIdAndUpdate = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));
    await updateCourse(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
    expect(actualError.message).toBe("Updating course failed");
  });
});
