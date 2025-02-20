import { validationResult } from "express-validator";
import studentController from "../../controllers/studentController";
import HttpError from "../../models/httpError";
import { Student } from "../../models/student";

const { getStudentById } = studentController;

jest.mock("express-validator");
jest.mock("../../models/student");

describe("Student get by id controller tests", () => {
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

  it("should return 404 if student not found", async () => {
    Student.findById = jest.fn().mockResolvedValue(null);

    await getStudentById(req, res, next);
    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(404);
    expect(actualError.message).toBe("Student not found");
  });

  it("should return student data if found", async () => {
    const mockStudent = { _id: "student123", firstName: "John" };
    Student.findById = jest.fn().mockResolvedValue(mockStudent);

    await getStudentById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStudent);
  });

  it("should return 500 for database errors", async () => {
    Student.findById = jest.fn().mockRejectedValue(new Error("Database error"));

    await getStudentById(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
    expect(actualError.message).toBe("Database error");
  });
});
