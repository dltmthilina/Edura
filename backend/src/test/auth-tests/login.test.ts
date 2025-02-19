import authController from "../../controllers/authController";
import User from "../../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../../models/httpError";

jest.mock("../../models/user");
jest.mock("bcryptjs");

const { login } = authController;

describe("User login controller test", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        email: "thilina@gmail.com",
        password: "hashedPassword",
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

  it("should return 401 for invalid credentials", async () => {
    const mockFind = jest.fn().mockResolvedValue([]);
    const psdCompare = jest.fn().mockResolvedValue(false);

    bcrypt.compare = psdCompare;
    User.findOne = mockFind;
    await login(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(401);
    expect(actualError.message).toBe("Invalid credentials");
  });

  it("should return 200 for successfull login", async () => {
    const existingUser = new User({
      _id: "mockUserId",
      firstName: "Thilina",
      lastName: "Disanayaka",
      email: "thilina@gmail.com",
      password: "hashedPassword",
    });
    const mockFind = jest.fn().mockResolvedValue(existingUser);
    const psdCompare = jest.fn().mockResolvedValue(true);
    bcrypt.compare = psdCompare;
    User.findOne = mockFind;

    await login(req, res, next);

    const expectedToken = jwt.sign(
      { userId: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET as string, // Use real JWT secret
      { expiresIn: "1h" }
    );

    expect(res.json).toHaveBeenCalledWith({
      token: expectedToken,
      message: "User login successfully!",
    });

    expect(res.status).toHaveBeenLastCalledWith(200);
  });

  it("should return 500 for database errors", async () => {
    const mockFind = jest.fn().mockRejectedValue(new Error("Database error"));
    User.findOne = mockFind;
    await login(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
  });
});
