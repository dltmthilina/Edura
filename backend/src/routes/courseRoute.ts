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
  authorize(["admin"]),
  courseController.createCourse
);
router.put(
  "/update",
  authenticate,
  authorize(["admin"]),
  courseController.updateCourse
);
router.get(
  "/get:adminId",
  authenticate,
  authorize(["admin"]),
  courseController.getCoursesByAdminId
);
router.get(
  "/get:id",
  authenticate,
  authorize(["admin", "student"]),
  courseController.getCourseById
);
router.delete(
  "/delete:id",
  authenticate,
  authorize(["admin"]),
  courseController.deleteCourse
);

export default router;
