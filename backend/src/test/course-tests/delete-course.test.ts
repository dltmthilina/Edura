import courseController from "../../controllers/courseController";
import HttpError from "../../models/httpError";
import Course from "../../models/course";

const { deleteCourse } = courseController;

jest.mock("../../models/course");

describe("Course delete controller test", () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {
      params: { id: "validCourseId" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 200 when course is successfully deleted", async () => {
    const mockCourse = new Course({
      title: "Introduction to Node.js",
      description: "A beginner-friendly Node.js course",
      duration: "6 weeks",
      materials: ["https://example.com/nodejs.pdf"],
    });
    Course.findOneAndDelete = jest.fn().mockResolvedValue(mockCourse);

    await deleteCourse(req, res, next);

    expect(Course.findOneAndDelete).toHaveBeenCalledWith({
      _id: "validCourseId",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Course deleted successfully",
    });
  });

  it("should return 500 for database errors", async () => {
    Course.findOneAndDelete = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await deleteCourse(req, res, next);

    expect(next).toHaveBeenCalled();
    const actualError = next.mock.calls[0][0];
    expect(actualError).toBeInstanceOf(HttpError);
    expect(actualError.code).toBe(500);
    expect(actualError.message).toBe("Could not delete course");
  });
});
