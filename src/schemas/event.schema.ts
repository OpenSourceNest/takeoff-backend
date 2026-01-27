import { z } from "zod";
import { Profession, ReferralSource, PipelineInterest } from "@prisma/client";

/**
 * Zod schema for creating an event registration
 * This replaces manual validation in the controller
 */
export const createEventRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .transform((val) => val.trim().toLowerCase()),
  isCommunityMember: z.boolean(),
  communityDetails: z.string().optional().nullable(),
  profession: z.array(z.nativeEnum(Profession)),
  professionOther: z.string().optional().nullable(),
  location: z.string(),
  locationOther: z.string().optional().nullable(),
  referralSource: z.nativeEnum(ReferralSource),
  referralSourceOther: z.string().optional().nullable(),
  newsletterSub: z.boolean(),
  pipelineInterest: z.nativeEnum(PipelineInterest),
  interests: z.string().optional().nullable(),
  openSourceKnowledge: z.coerce
    .number()
    .min(1, "Open source knowledge must be at least 1")
    .max(10, "Open source knowledge must be at most 10"),
});

/**
 * TypeScript type inferred from the Zod schema
 * Use this type in your controller for type safety
 */
export type CreateEventRegistrationInput = z.infer<
  typeof createEventRegistrationSchema
>;

/**
 * Zod schema for updating an event registration
 * All fields are optional for partial updates
 */
export const updateEventRegistrationSchema =
  createEventRegistrationSchema.partial();

export type UpdateEventRegistrationInput = z.infer<
  typeof updateEventRegistrationSchema
>;
