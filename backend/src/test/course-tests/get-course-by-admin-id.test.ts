import express, { Request, Response, NextFunction } from "express";
import courseController from "../../controllers/courseController";
import HttpError from "../../models/httpError";
import Course from "../../models/course";

jest.mock("../../models/course");

describe("Get courses by admin ID controller test", () => {
  let req: any, res: any, next: jest.Mock;
  const { getCoursesByAdminId } = courseController;

  beforeEach(() => {
    req = {
      params: { adminId: "admin123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 200 and list of courses", async () => {
    const mockCourses = [
      {
        _id: "course1",
        title: "Course 1",
        description: "Description 1",
        duration: "6 weeks",
        materials: ["https://example.com/material1.pdf"],
      },
      {
        _id: "course2",
        title: "Course 2",
        description: "Description 2",
        duration: "8 weeks",
        materials: ["https://example.com/material2.pdf"],
      },
    ];

    Course.find = jest.fn().mockResolvedValue(mockCourses);
    await getCoursesByAdminId(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ courses: mockCourses });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if no courses found", async () => {
    Course.find = jest.fn().mockResolvedValue([]);
    await getCoursesByAdminId(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(404);
    expect(actualError.message).toBe("No courses found");
  });

  it("should return 500 for database errors", async () => {
    Course.find = jest.fn().mockRejectedValue(new Error("Database error"));
    await getCoursesByAdminId(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
    expect(actualError.message).toBe("Fetching courses failed");
  });
});
