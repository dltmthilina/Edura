import { validationResult } from "express-validator";
import studentController from "../../controllers/userController";
import HttpError from "../../models/httpError";
import { Student } from "../../models/student";

const { getAllStudents } = studentController;

jest.mock("express-validator");
jest.mock("../../models/student");

describe(" All Student get  controller tests", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all students", async () => {
    const mockStudents = [{ _id: "student1" }, { _id: "student2" }];
    Student.find = jest.fn().mockResolvedValue(mockStudents);

    await getAllStudents(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStudents);
  });

  it("should return 500 for database errors", async () => {
    Student.find = jest.fn().mockRejectedValue(new Error("Database error"));

    await getAllStudents(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
    expect(actualError.message).toBe("Database error");
  });
});
