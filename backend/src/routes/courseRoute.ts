import express from "express";
import { check } from "express-validator";
import courseController from "../controllers/courseController";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

const router = express.Router();

router.post(
  "/create",
  [
    check("title").isString().not().isEmpty(),
    check("description").isString().not().isEmpty(),
    check("duration").isString().not().isEmpty(),
  ],
  authenticate,
  authorize(["tutor"]),
  courseController.createCourse
);
router.put(
  "/update/:id",
  authenticate,
  authorize(["tutor"]),
  courseController.updateCourse
);
router.get(
  "/get/user/all",
  authenticate,
  authorize(["tutor"]),
  courseController.getCoursesByAdminId
);
router.get(
  "/get/:id",
  authenticate,
  authorize(["tutor", "student"]),
  courseController.getCourseById
);
router.get(
  "/get/all",
  authenticate,
  authorize(["tutor", "student"]),
  courseController.getAllCourses
);
router.delete(
  "/delete/:id",
  authenticate,
  authorize(["tutor"]),
  courseController.deleteCourse
);

export default router;
