import { validationResult } from "express-validator";
import studentController from "../../controllers/userController";
import HttpError from "../../models/httpError";
import { Student } from "../../models/student";

const { deleteStudent } = studentController;

jest.mock("express-validator");
jest.mock("../../models/student");

describe(" Student delete  controller tests", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {
      params: { studentId: "student123" },
      body: { address: "New Address" },
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete student if found", async () => {
    Student.findByIdAndDelete = jest
      .fn()
      .mockResolvedValue({ _id: "student123" });

    await deleteStudent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Student deleted" });
  });

  it("should return 404 if student not found", async () => {
    Student.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await deleteStudent(req, res, next);

    expect(next).toHaveBeenCalledWith(new HttpError("Student not found", 404));
  });

  it("should return 500 for database errors", async () => {
    Student.findByIdAndDelete = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await deleteStudent(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
    expect(actualError.message).toBe("Database error");
  });
});
