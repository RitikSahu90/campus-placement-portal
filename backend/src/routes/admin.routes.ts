import { Router } from "express";
import { getAdminJobs, getUsers, removeAdminJob, removeUser } from "../controllers/admin.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get("/users", authenticate, authorize("admin"), getUsers);
router.delete("/users/:id", authenticate, authorize("admin"), removeUser);
router.get("/jobs", authenticate, authorize("admin"), getAdminJobs);
router.delete("/jobs/:id", authenticate, authorize("admin"), removeAdminJob);

export default router;
