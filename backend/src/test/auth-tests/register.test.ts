import authController from "../../controllers/authController";
import User from "../../models/user";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import HttpError from "../../models/httpError";

jest.mock("express-validator");
jest.mock("../../models/user");

const { register } = authController;

describe("User register controller test", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        firstName: "Thilina",
        lastName: "Disanayaka",
        email: "thilina@gmail.com",
        password: "123456",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 for validation errors", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue([{ msg: "Invalid input" }]),
    });
    await register(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.message).toBe("Invalid user data");
    expect(actualError.code).toBe(400);
  });

  it("should return 201 for successfull egistrationr", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    });

    const mockUser = new User({
      _id: "mockUserId",
      firstName: "Thilina",
      lastName: "Disanayaka",
      email: "thilina@gmail.com",
      password: "hashedPassword",
    });

    const mockCreate = jest.fn().mockResolvedValue({ user: mockUser });
    User.create = mockCreate;
    await register(req, res, next);

    const expectedToken = jwt.sign(
      { userId: mockUser._id, role: undefined },
      process.env.JWT_SECRET as string, // Use real JWT secret
      { expiresIn: "1h" }
    );

    expect(mockCreate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      token: expectedToken,
      message: "User registered successfully!",
    });
  });

  it("should retun 500 for database error", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    });

    const mockCreate = jest.fn().mockRejectedValue(new Error("Database error"));
    User.create = mockCreate;
    await register(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
  });
});
