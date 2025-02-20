import { Request, Response, NextFunction } from "express";
import enrollController from "../../controllers/enrollController";
import HttpError from "../../models/httpError";
import { Enrollment } from "../../models/enrollment";

const { updateEnrollmentStatus } = enrollController;

jest.mock("../../models/enrollment");

describe("Enrollment Status Update Controller Tests", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {
      params: { enrollmentId: "enroll789" },
      body: { status: "Completed" },
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update enrollment status successfully", async () => {
    const mockEnrollment = {
      _id: "enroll789",
      studentId: "student123",
      courseId: "course456",
      status: "Active",
      save: jest.fn().mockImplementation(function (this: any) {
        this.status = "Completed";
        return Promise.resolve(this);
      }),
    };

    Enrollment.findById = jest.fn().mockResolvedValue(mockEnrollment);

    await updateEnrollmentStatus(req, res, next);

    expect(mockEnrollment.status).toBe("Completed");
    expect(mockEnrollment.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Enrollment status updated",
      enrollment: mockEnrollment,
    });
  });

  it("should return 404 if enrollment is not found", async () => {
    Enrollment.findById = jest.fn().mockResolvedValue(null);

    await updateEnrollmentStatus(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new HttpError("Enrollment not found", 404)
    );
  });

  it("should return 500 for database errors", async () => {
    Enrollment.findById = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await updateEnrollmentStatus(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
    expect(actualError.message).toBe("Database error");
  });
});
