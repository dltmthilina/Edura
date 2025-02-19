import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoute";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

interface CustomError extends Error {
  code?: number; // Optional property for error code
}

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("api/course", () => {});
app.use("api/student", () => {});
app.use("api/enrole", () => {});
app.use("api/upload", () => {});

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(error);
    }
    res.status(error.code || 400);
    res.json({ message: error.message || "An unknown error occured!" });
  }
);

mongoose
  .connect(MONGO_URI!)
  .then((result: any) => {
    console.log("mongodb connected");
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((err: any) => {
    console.log(err);
  });
