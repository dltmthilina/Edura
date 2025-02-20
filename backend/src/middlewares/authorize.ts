import { Request, Response, NextFunction } from "express";
import HttpError from "../models/httpError";
import { AuthRequest } from "../utils/common-interfaces";

const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Extract user role from request (assuming `req.user` contains authenticated user details)
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return next(
        new HttpError("Access denied. Insufficient permissions.", 403)
      );
    }

    next();
  };
};

export default authorize;
