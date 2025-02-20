import express from "express";
import studentController from "../controllers/studentController";

const { updateStudent, getStudentById, getAllStudents, deleteStudent } =
  studentController;

const router = express.Router();

router.post("/update:sid", updateStudent);
router.get("/get-all", getAllStudents);
router.get("/get:sid", getStudentById);
router.delete("/delete", deleteStudent);

export default router;
