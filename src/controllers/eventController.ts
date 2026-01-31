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

/**
 * GET EVENT CONFIG
 */
export const getEventConfig = asyncHandler(
  async (_req: Request, res: Response) => {
    const config = await eventService.getEventConfig();
    res.json({
      success: true,
      data: config,
    });
  },
);

/**
 * UPDATE EVENT CONFIG
 */
export const updateEventConfig = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { eventId, targetCapacity } = req.body;

    if (!eventId || !targetCapacity) {
      return next(new AppError("Event ID and Target Capacity are required.", 400));
    }

    const updated = await eventService.updateEventConfig(eventId, Number(targetCapacity));

    res.json({
      success: true,
      data: updated,
    });
  },
);

/**
 * CHECK-IN ATTENDEE
 */
export const checkInAttendee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };

    const registration = await eventService.getRegistrationById(id);

    if (!registration) {
      return next(new AppError("Registration not found.", 404));
    }

    const updated = await eventService.checkInAttendee(id);

    res.json({
      success: true,
      data: updated,
      message: "Attendee checked in successfully.",
    });
  },
);

/**
 * GET REGISTRATION QR CODE
 */
export const getEventRegistrationQR = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };

    const qrCode = await eventService.generateQRCode(id);

    if (!qrCode) {
      return next(new AppError("Registration not found or QR generation failed.", 404));
    }

    res.json({
      success: true,
      qrCode,
    });
  },
);


