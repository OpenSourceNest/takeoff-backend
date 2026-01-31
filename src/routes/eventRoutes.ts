import express from "express";
import {
  createEventRegistration,
  getEventRegistrations,
  getEventRegistration,
  updateEventRegistration,
  searchEventRegistrations,
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
router.get("/search", authorize([Role.ADMIN]), searchEventRegistrations);
export default router;
