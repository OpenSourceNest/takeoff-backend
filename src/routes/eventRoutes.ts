import express from "express";
import {
  createEventRegistration,
  getEventRegistrations,
  getEventRegistration,
  updateEventRegistration,
  searchEventRegistrations,
  getEventConfig,
  updateEventConfig,
} from "../controllers/eventController";

import { authorize } from "../middleware/authorize";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/register", createEventRegistration);
router.get("/registrations", authorize([Role.ADMIN]), getEventRegistrations);
router.get("/registrations/:id", authorize([Role.ADMIN]), getEventRegistration);
router.put(
  "/registrations/:id",
  authorize([Role.ADMIN]),
  updateEventRegistration,
);
router.get("/config", authorize([Role.ADMIN]), getEventConfig);
router.put("/config", authorize([Role.ADMIN]), updateEventConfig);

router.get("/search", authorize([Role.ADMIN]), searchEventRegistrations);
export default router;
