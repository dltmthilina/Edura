import { Request, Response, NextFunction } from "express";
import enrollController from "../../controllers/enrollController";
import HttpError from "../../models/httpError";
import { Enrollment } from "../../models/enrollment";

const { unEnrollStudent } = enrollController;

jest.mock("../../models/enrollment");

describe("Unenroll Student", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = { params: { id: "enroll789" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should unenroll a student successfully", async () => {
    Enrollment.findByIdAndDelete = jest
      .fn()
      .mockResolvedValue({ _id: "enroll789" });

    await unEnrollStudent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Enrollment removed" });
  });

  it("should return 404 if enrollment not found", async () => {
    Enrollment.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await unEnrollStudent(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new HttpError("Enrollment not found", 404)
    );
  });

  it("should return 500 for database errors", async () => {
    Enrollment.findByIdAndDelete = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await unEnrollStudent(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
    expect(actualError.message).toBe("Database error");
  });
});
