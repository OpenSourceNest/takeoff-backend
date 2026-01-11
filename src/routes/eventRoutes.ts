import express from "express";
import {
  createEventRegistration,
  getEventRegistrations,
  updateEventRegistration,
  deleteEventRegistration,
} from "../controllers/eventController";

const router = express.Router();

router.post("/register", createEventRegistration);
router.get("/registrations", getEventRegistrations);
router.put("/registrations/:id", updateEventRegistration);

// TODO - Get single registration by ID
// router.delete('/registrations/:id', deleteEventRegistration);

export default router;
