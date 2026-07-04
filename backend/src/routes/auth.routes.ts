import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isEmail, isRequiredString, isRole, validateBody } from "../middleware/validate.middleware";

const router = Router();

router.post(
  "/register",
  validateBody({
    name: isRequiredString,
    email: isEmail,
    password: isRequiredString,
    role: isRole
  }),
  register
);
router.post(
  "/login",
  validateBody({ email: isEmail, password: isRequiredString }),
  login
);
router.get("/me", authenticate, me);

export default router;
