import express from "express";
import { check } from "express-validator";
import courseController from "../controllers/courseController";

const router = express.Router();

router.post(
  "/create",
  [
    check("title").isString().not().isEmpty(),
    check("description").isString().not().isEmpty(),
    check("duration").isString().not().isEmpty(),
  ],
  courseController.createCourse
);
router.put("/update", courseController.updateCourse);
router.get("/get:adminId", courseController.getCoursesByAdminId);
router.get("/get:id", courseController.getCourseById);
router.delete("/delete", courseController.deleteCourse);

export default router;
