import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

app.use("api/auth", () => {});
app.use("api/course", () => {});
app.use("api/student", () => {});
app.use("api/enrole", () => {});
app.use("api/upload", () => {});

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
