import express from "express";
import enrollController from "../controllers/enrollController";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

const { enrollStudent, unEnrollStudent, updateEnrollmentStatus } =
  enrollController;

const router = express.Router();

router.post("/enroll", authenticate, enrollStudent);
router.post("/unenroll", authenticate, unEnrollStudent);
router.patch("/enrollment/status", authenticate, updateEnrollmentStatus);

export default router;
