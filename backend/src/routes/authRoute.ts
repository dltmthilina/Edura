import express from "express";
import { check } from "express-validator";
import authController from "../controllers/authController";

const router = express.Router();

router.post("/login", authController.login);

router.post(
  "/register",
  [
    check("firstName").isString().not().isEmpty(),
    check("email").isEmail().not().isEmpty(),
    check("password").isString().isLength({ min: 6 }),
  ],
  authController.register
);

export default router;
