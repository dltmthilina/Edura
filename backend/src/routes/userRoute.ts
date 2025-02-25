import express from "express";
import userController from "../controllers/userController";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

const {
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  getAllStudents,
  getAllTutors,
  updateUserRole,
} = userController;

const router = express.Router();

router.get(
  "/get/students/all",
  authenticate,
  authorize(["tutor"]),
  getAllStudents
);
router.get(
  "/get/tutors/all",
  authenticate,
  authorize(["tutor", "student"]),
  getAllTutors
);
router.get(
  "/get/:uid",
  authenticate,
  authorize(["tutor", "student"]),
  getUserById
);
router.delete("/delete/:uid", authenticate, authorize(["tutor"]), deleteUser);
router.put("/update/:uid", authenticate, authorize(["tutor"]), updateUser);
router.get("/all", authenticate, authorize(["tutor"]), getAllUsers);
router.patch("/update/role", authenticate, updateUserRole);

export default router;
