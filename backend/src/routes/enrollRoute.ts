import express from "express";
import enrollController from "../controllers/enrollController";

const { enrollStudent, unEnrollStudent, updateEnrollmentStatus } =
  enrollController;

const router = express.Router();

router.post("/enroll", enrollStudent);
router.post("/unenroll:enrollmentId", unEnrollStudent);
router.patch("/:enrollmentId/status", updateEnrollmentStatus);

export default router;
