import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types";
import { getUserById, loginUser, registerUser } from "../services/auth.service";
import { successResponse } from "../utils/response";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await registerUser(req.body);
    return successResponse(res, "Registration successful", result, 201);
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body.email, req.body.password);
    return successResponse(res, "Login successful", result);
  } catch (error) {
    return next(error);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await getUserById(req.user!.id);
    return successResponse(res, "Current user fetched", user);
  } catch (error) {
    return next(error);
  }
}
