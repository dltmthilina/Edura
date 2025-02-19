import courseController from "../../controllers/courseController";
import HttpError from "../../models/httpError";
import Course from "../../models/course";

const { deleteCourse } = courseController;

jest.mock("../../models/course");

describe("Course delete controller test", () => {
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

    await deleteCourse(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(404);
    expect(actualError.message).toBe("Course not found");
  });

  it("should return 200 when course is successfully deleted", async () => {
    const mockCourse = { remove: jest.fn().mockResolvedValue(true) };
    Course.findById = jest.fn().mockResolvedValue(mockCourse);

    await deleteCourse(req, res, next);

    expect(mockCourse.remove).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Course deleted successfully" });
  });

  it("should return 500 for database errors", async () => {
    Course.findById = jest.fn().mockRejectedValue(new Error("Database error"));

    await deleteCourse(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
    expect(actualError.message).toBe("Could not delete course");
  });
});
