import { Request, Response, NextFunction } from "express";
import HttpError from "../models/httpError";
import { AuthRequest } from "../utils/common-interfaces";

const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Extract user role from request (assuming `req.user` contains authenticated user details)
    const userRoles = req.user?.roles;
    console.log(allowedRoles, userRoles);
    function hasCommonElement() {
      return allowedRoles.some((element) => userRoles?.includes(element));
    }

    console.log(hasCommonElement());

    if (!userRoles || userRoles.length == 0 || !hasCommonElement()) {
      return next(
        new HttpError("Access denied. Insufficient permissions.", 403)
      );
    }

    next();
  };
};

export default authorize;
