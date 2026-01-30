import { Router } from "express";
import * as analyticsController from "../controllers/analyticsController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all analytics routes with Auth + Admin requirement
router.use(requireAuth, requireAdmin);

router.get("/overview", analyticsController.getOverview);
router.get("/velocity", analyticsController.getVelocity);
router.get("/demographics", analyticsController.getDemographics);

export default router;
