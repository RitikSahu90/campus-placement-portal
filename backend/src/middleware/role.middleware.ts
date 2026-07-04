import { NextFunction, Response } from "express";
import { AuthRequest, UserRole } from "../types";

export function authorize(...roles: UserRole[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error("You are not allowed to perform this action");
      (error as Error & { statusCode?: number }).statusCode = 403;
      return next(error);
    }

    return next();
  };
}
