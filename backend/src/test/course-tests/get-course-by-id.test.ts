import courseController from "../../controllers/courseController";
import HttpError from "../../models/httpError";
import Course from "../../models/course";

const { getCourseById } = courseController;

jest.mock("../../models/course");

describe("Course get by ID controller test", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {
      params: { courseId: "validCourseId" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 404 if course is not found", async () => {
    Course.findById = jest.fn().mockResolvedValue(null);

    await getCourseById(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(404);
    expect(actualError.message).toBe("Course not found");
  });

  it("should return 200 and the course data if found", async () => {
    const mockCourse = {
      _id: "validCourseId",
      title: "Introduction to Node.js",
      description: "A beginner-friendly Node.js course",
      duration: "6 weeks",
      materials: ["https://example.com/nodejs.pdf"],
    };
    Course.findById = jest.fn().mockResolvedValue(mockCourse);

    await getCourseById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ course: mockCourse });
  });

  it("should return 500 for database errors", async () => {
    Course.findById = jest.fn().mockRejectedValue(new Error("Database error"));

    await getCourseById(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
    expect(actualError.message).toBe("Could not retrieve course");
  });
});
