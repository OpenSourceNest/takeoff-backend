import { z } from "zod";

/**
 * Login schema validation
 */
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .transform((val) => val.trim().toLowerCase()),
    password: z.string().min(1, "Password is required")
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Register/Create admin schema validation
 */
export const createAdminSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .transform((val) => val.trim().toLowerCase()),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
