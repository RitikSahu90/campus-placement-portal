import { NextFunction, Request, Response } from "express";
import { ApiError } from "../types";
import { errorResponse } from "../utils/response";

export function notFoundHandler(req: Request, res: Response) {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

export function errorHandler(
  error: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Something went wrong" : error.message;

  if (statusCode === 500) {
    console.error(error);
  }

  return errorResponse(res, message, statusCode);
}
