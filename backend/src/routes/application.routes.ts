import { Router } from "express";
import { createApplication, getApplications } from "../controllers/application.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { isNumberLike, validateBody } from "../middleware/validate.middleware";

const router = Router();

router.post("/", authenticate, authorize("student"), validateBody({ jobId: isNumberLike }), createApplication);
router.get("/", authenticate, authorize("student", "recruiter"), getApplications);

export default router;
