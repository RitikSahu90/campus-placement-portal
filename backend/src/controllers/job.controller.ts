import { NextFunction, Request, Response } from "express";
import { createJob, deleteJob, getJobById, listJobs, updateJob } from "../services/job.service";
import { AuthRequest } from "../types";
import { successResponse } from "../utils/response";

export async function getJobs(_req: Request, res: Response, next: NextFunction) {
  try {
    const jobs = await listJobs();
    return successResponse(res, "Jobs fetched", jobs);
  } catch (error) {
    return next(error);
  }
}

export async function getJob(req: Request, res: Response, next: NextFunction) {
  try {
    const job = await getJobById(Number(req.params.id));
    return successResponse(res, "Job fetched", job);
  } catch (error) {
    return next(error);
  }
}

export async function createNewJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const job = await createJob(req.user!.id, req.body);
    return successResponse(res, "Job created", job, 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateExistingJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const job = await updateJob(Number(req.params.id), req.user!.id, req.body);
    return successResponse(res, "Job updated", job);
  } catch (error) {
    return next(error);
  }
}

export async function removeJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await deleteJob(Number(req.params.id), {
      userId: req.user!.id,
      isAdmin: req.user!.role === "admin"
    });
    return successResponse(res, "Job deleted");
  } catch (error) {
    return next(error);
  }
}
