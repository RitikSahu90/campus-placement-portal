import { Router } from "express";
import { createNewJob, getJob, getJobs, removeJob, updateExistingJob } from "../controllers/job.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { isRequiredString, validateBody } from "../middleware/validate.middleware";

const router = Router();

const jobRules = {
  title: isRequiredString,
  description: isRequiredString,
  location: isRequiredString,
  deadline: isRequiredString
};

router.get("/", getJobs);
router.get("/:id", getJob);
router.post("/", authenticate, authorize("recruiter"), validateBody(jobRules), createNewJob);
router.put("/:id", authenticate, authorize("recruiter"), validateBody(jobRules), updateExistingJob);
router.delete("/:id", authenticate, authorize("recruiter", "admin"), removeJob);

export default router;
