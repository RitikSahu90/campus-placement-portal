import { NextFunction, Request, Response } from "express";
import { deleteUser, listAllJobs, listUsers } from "../services/admin.service";
import { deleteJob } from "../services/job.service";
import { successResponse } from "../utils/response";

export async function getUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await listUsers();
    return successResponse(res, "Users fetched", users);
  } catch (error) {
    return next(error);
  }
}

export async function removeUser(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteUser(Number(req.params.id));
    return successResponse(res, "User deleted");
  } catch (error) {
    return next(error);
  }
}

export async function getAdminJobs(_req: Request, res: Response, next: NextFunction) {
  try {
    const jobs = await listAllJobs();
    return successResponse(res, "Jobs fetched", jobs);
  } catch (error) {
    return next(error);
  }
}

export async function removeAdminJob(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteJob(Number(req.params.id), { userId: 0, isAdmin: true });
    return successResponse(res, "Job deleted");
  } catch (error) {
    return next(error);
  }
}
