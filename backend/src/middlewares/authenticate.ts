import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../utils/common-interfaces";
import jwt, { JwtPayload } from "jsonwebtoken";
import HttpError from "../models/httpError";

interface DecodedToken extends JwtPayload {
  userId: string;
  roles: string[];
}

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"
  if (!token) {
    return next(
      new HttpError("Authentication failed. No token provided.", 401)
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    
    req.user = { userId: decoded.userId, roles: decoded.roles }; // Store user data (e.g., id & role) in req.user
    next();
  } catch (error) {
    return next(new HttpError("Invalid or expired token", 403));
  }
};

export default authenticate;
