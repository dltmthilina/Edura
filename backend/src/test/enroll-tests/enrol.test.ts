import { Request, Response, NextFunction } from "express";
import enrollController from "../../controllers/enrollController";
import HttpError from "../../models/httpError";
import { Enrollment } from "../../models/enrollment";

const { enrollStudent, unEnrollStudent } = enrollController;

jest.mock("../../models/enrollment");

describe("Enrollment student Controller Tests", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = { body: { studentId: "student123", courseId: "course456" } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should enroll a student successfully", async () => {
    const mockEnrollment = {
      _id: "enroll789",
      studentId: "student123",
      courseId: "course456",
      status: "Active",
    };
    Enrollment.create = jest.fn().mockResolvedValue(mockEnrollment);

    await enrollStudent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockEnrollment);
  });

  it("should return 400 if student is already enrolled", async () => {
    const existingEnrollment = {
      _id: "enroll789",
      studentId: "student123",
      courseId: "course456",
      status: "Active",
    };

    Enrollment.findOne = jest.fn().mockResolvedValue(existingEnrollment);

    await enrollStudent(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(400);
    expect(actualError.message).toBe(
      "Student is already enrolled in this course"
    );
  });

  it("should return 500 for database errors", async () => {
    Enrollment.findOne = jest.fn().mockResolvedValue(null);
    Enrollment.create = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await enrollStudent(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.message).toBe("Database error");
    expect(actualError.code).toBe(500);
  });
});
