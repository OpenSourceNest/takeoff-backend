import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/login", authController.login);

// Protected routes
router.get("/me", requireAuth, authController.getCurrentUser);
router.post("/logout", requireAuth, authController.logout);

export default router;
