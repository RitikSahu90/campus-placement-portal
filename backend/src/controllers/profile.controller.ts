import { NextFunction, Response } from "express";
import { getProfile, upsertProfile } from "../services/profile.service";
import { AuthRequest } from "../types";
import { successResponse } from "../utils/response";

export async function getMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const profile = await getProfile(req.user!.id);
    return successResponse(res, "Profile fetched", profile);
  } catch (error) {
    return next(error);
  }
}

export async function updateMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const profile = await upsertProfile(req.user!.id, req.body);
    return successResponse(res, "Profile updated", profile);
  } catch (error) {
    return next(error);
  }
}
