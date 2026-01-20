import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
// import { SendMail } from "../utils/mail.util";
import { createEventRegistrationSchema, updateEventRegistrationSchema } from "../schemas/event.schema";
import { z } from "zod";

export const createEventRegistration = async (req: Request, res: Response) => {
  try {
    // Validate and parse request data using Zod
    const validatedData = createEventRegistrationSchema.parse(req.body);

    // Create registration with validated data
    const registration = await prisma.eventRegistration.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        isCommunityMember: validatedData.isCommunityMember,
        communityDetails: validatedData.communityDetails || null,
        profession: validatedData.profession,
        professionOther: validatedData.professionOther || null,
        location: validatedData.location,
        locationOther: validatedData.locationOther || null,
        referralSource: validatedData.referralSource,
        newsletterSub: validatedData.newsletterSub,
        pipelineInterest: validatedData.pipelineInterest,
        interests: validatedData.interests || null,
        openSourceKnowledge: validatedData.openSourceKnowledge,
      },
    });

    // Send welcome email after successful registration
    // write a function to send email



    res.status(201).json({
      success: true,
      data: registration,
    });
  } catch (error: any) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.issues[0].message, // Return first validation error
        validationErrors: error.issues, // Include all validation errors for debugging
      });
    }

    // Handle Prisma duplicate email error
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(409).json({
        success: false,
        error: "This email address is already registered.",
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || "Unable to register.",
    });
  }
};

/**
 * GET ALL REGISTRATIONS
 */
export const getEventRegistrations = async (_req: Request, res: Response) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: registrations,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Failed to fetch registrations.",
    });
  }
};

/*
 * GET SINGLE REGISTRATION
 */
export const getEventRegistration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const registration = await prisma.eventRegistration.findUnique({
      where: { id },
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: "Registration not found.",
      });
    }

    res.json({
      success: true,
      data: registration,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Failed to fetch registration.",
    });
  }
};

/**
 * SEARCH REGISTRATIONS
 */
export const searchEventRegistrations = async (req: Request, res: Response) => {
  try {
    const { search } = req.query as { search: string };

    const registrations = await prisma.eventRegistration.findMany({
      where: {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    res.json({
      success: true,
      data: registrations,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "Failed to search registrations.",
    });
  }
};

/**
 * UPDATE REGISTRATION
 */
export const updateEventRegistration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    // Validate update data using Zod
    const validatedData = updateEventRegistrationSchema.parse(req.body);

    const registration = await prisma.eventRegistration.update({
      where: { id },
      data: validatedData,
    });

    res.json({
      success: true,
      data: registration,
    });
  } catch (error: any) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.issues[0].message,
        validationErrors: error.issues,
      });
    }

    // Handle Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Registration not found.",
      });
    }

    res.status(400).json({
      success: false,
      error: "Failed to update registration.",
    });
  }
};