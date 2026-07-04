import { NextFunction, Response } from "express";
import {
  applyForJob,
  listApplicantsForRecruiter,
  listApplicationsForStudent
} from "../services/application.service";
import { AuthRequest } from "../types";
import { successResponse } from "../utils/response";

export async function createApplication(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const application = await applyForJob(req.user!.id, Number(req.body.jobId), req.body.coverLetter);
    return successResponse(res, "Application submitted", application, 201);
  } catch (error) {
    return next(error);
  }
}

export async function getApplications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const applications =
      req.user!.role === "recruiter"
        ? await listApplicantsForRecruiter(req.user!.id)
        : await listApplicationsForStudent(req.user!.id);

    return successResponse(res, "Applications fetched", applications);
  } catch (error) {
    return next(error);
  }
}
