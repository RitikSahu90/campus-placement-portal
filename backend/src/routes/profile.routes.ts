import { Router } from "express";
import { getMyProfile, updateMyProfile } from "../controllers/profile.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get("/", authenticate, authorize("student"), getMyProfile);
router.put("/", authenticate, authorize("student"), updateMyProfile);

export default router;
