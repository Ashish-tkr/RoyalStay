import { Router } from "express";
import { body } from "express-validator";
import { login, me } from "../Controllers/adminAuthController.js";
import { protect } from "../middleware/adminAuthMiddleware.js";

const router = Router();

/**
 * POST /api/auth/login
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ],
  login
);

router.get("/me", protect, me);

export default router;
