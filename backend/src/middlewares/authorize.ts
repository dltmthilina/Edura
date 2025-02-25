import { Request, Response, NextFunction } from "express";
import HttpError from "../models/httpError";
import { AuthRequest } from "../utils/common-interfaces";

const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Extract user role from request (assuming `req.user` contains authenticated user details)
    const userRole = req.user?.activeRole;
    function isAuthorize() {
      return allowedRoles.some((element) => userRole === element);
    }

    if (!userRole || isAuthorize()) {
      return next(
        new HttpError("Access denied. Insufficient permissions.", 403)
      );
    }

    next();
  };
};

export default authorize;
