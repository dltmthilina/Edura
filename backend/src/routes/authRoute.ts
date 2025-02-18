import express from "express";
import { check } from "express-validator";
import authController from "../controllers/authController";

const router = express.Router();

router.post("/sign-in", authController.login);

router.post(
  "/sign-up",
  [
    check("firstName").isString().not().isEmpty(),
    check("email").isEmail().not().isEmpty(),
    check("password").isString().isLength({ min: 6 }),
  ],

 
);

module.exports = router


