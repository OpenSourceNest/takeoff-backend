import { NextFunction, Request, Response } from "express";
import {
  createEventRegistrationSchema,
  updateEventRegistrationSchema,
} from "../schemas/event.schema";
import * as eventService from "../services/eventService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { SendMail } from "../utils/mail.util";

export const createEventRegistration = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate and parse request data using Zod
    const validatedData = createEventRegistrationSchema.parse(
      req.body as unknown,
    );

    // Create registration with validated data
    const registration = await eventService.createRegistration(validatedData);

    SendMail({
      to: registration.email,
      subject: "You've Secured Your Spot at Takeoff by Open Source Nest! 🚀",
      category: "Attendee_Registration_Successful",
      extraArguments: {
        firstName: registration.firstName,
      },
    });

    res.status(201).json({
      success: true,
      data: registration,
    });
  },
);

/**
 * GET ALL REGISTRATIONS
 */
export const getEventRegistrations = asyncHandler(
  async (_req: Request, res: Response) => {
    const registrations = await eventService.getAllRegistrations();

    res.json({
      success: true,
      data: registrations,
    });
  },
);

/*
 * GET SINGLE REGISTRATION
 */
export const getEventRegistration = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };

    const registration = await eventService.getRegistrationById(id);

    if (!registration) {
      return next(new AppError("Registration not found.", 404));
    }

    res.json({
      success: true,
      data: registration,
    });
  },
);

/**
 * SEARCH REGISTRATIONS
 */
export const searchEventRegistrations = asyncHandler(
  async (req: Request, res: Response) => {
    const { search } = req.query as { search: string };

    const registrations = await eventService.searchRegistrations(search);

    res.json({
      success: true,
      data: registrations,
    });
  },
);

/**
 * UPDATE REGISTRATION
 */
export const updateEventRegistration = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    // Validate update data using Zod
    const validatedData = updateEventRegistrationSchema.parse(req.body);

    const registration = await eventService.updateRegistration(
      id,
      validatedData,
    );

    res.json({
      success: true,
      data: registration,
    });
  },
);
