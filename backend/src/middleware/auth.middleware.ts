import { NextFunction, Response } from "express";
import { AuthRequest } from "../types";
import { verifyToken } from "../utils/jwt";

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    const error = new Error("Authentication token is required");
    (error as Error & { statusCode?: number }).statusCode = 401;
    return next(error);
  }

  try {
    req.user = verifyToken(header.split(" ")[1]);
    return next();
  } catch {
    const error = new Error("Invalid or expired token");
    (error as Error & { statusCode?: number }).statusCode = 401;
    return next(error);
  }
}
