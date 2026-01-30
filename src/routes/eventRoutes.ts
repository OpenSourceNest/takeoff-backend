import express from "express";
import {
  createEventRegistration,
  getEventRegistrations,
  getEventRegistration,
  updateEventRegistration,
  searchEventRegistrations,
  checkInAttendee,
} from "../controllers/eventController";

import { authorize } from "../middleware/authorize";
import { Role } from "../../generated/prisma";

const router = express.Router();

router.post("/register", createEventRegistration);
router.get("/registrations", authorize([Role.ADMIN]), getEventRegistrations);
router.get("/registrations/:id", authorize([Role.ADMIN]), getEventRegistration);
router.put("/registrations/:id", authorize([Role.ADMIN]), updateEventRegistration);
router.post("/registrations/:id/checkin", authorize([Role.ADMIN]), checkInAttendee);
router.get("/search", authorize([Role.ADMIN]), searchEventRegistrations);
export default router;
