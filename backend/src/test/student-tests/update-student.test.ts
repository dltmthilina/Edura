import { validationResult } from "express-validator";
import studentController from "../../controllers/userController";
import HttpError from "../../models/httpError";
import { Student } from "../../models/student";

const { updateStudent } = studentController;

jest.mock("express-validator");
jest.mock("../../models/student");

describe("Student update controller tests", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {
      params: { sid: "student123" },
      body: { address: "New Address" },
    };

    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 for invalid input", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue([{ msg: "Invalid input" }]),
    });

    await updateStudent(req, res, next);
    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(400);
    expect(actualError.message).toBe("Invalid details");
  });

  it("should return 404 if student not found", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    });
    Student.findById = jest.fn().mockResolvedValue(null);

    await updateStudent(req, res, next);

    expect(next).toHaveBeenCalledWith(new HttpError("Student not found", 404));
  });

  it("should update and return student", async () => {
    const mockStudent = { _id: "student123", address: "New Address" };
    Student.findByIdAndUpdate = jest.fn().mockResolvedValue(mockStudent);

    await updateStudent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStudent);
  });

  it("should return 500 for database errors", async () => {
    Student.findByIdAndUpdate = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await updateStudent(req, res, next);

    expect(next).toHaveBeenCalledWith(new HttpError("Database error", 500));
  });
});
