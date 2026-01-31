import { Request, Response, NextFunction } from "express";
import { loginSchema } from "../schemas/auth.schema.js";
import * as authService from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

/**
 * REGISTER - POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
    // Use createAdminSchema for strong password validation
    // We import it as createAdminSchema but it's effectively our registerSchema
    // You might want to rename it in the schema file later for clarity
    const { createAdminSchema } = await import("../schemas/auth.schema.js");

    // Validate request body
    const validatedData = createAdminSchema.parse(req.body);

    // Register user
    const result = await authService.register(validatedData.email, validatedData.password);

    res.status(201).json({
        success: true,
        data: result,
        message: "Registration successful"
    });
});

/**
 * LOGIN - POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Authenticate user
    const result = await authService.login(validatedData.email, validatedData.password);

    res.json({
        success: true,
        data: result,
        message: "Login successful"
    });
});

/**
 * GET CURRENT USER - GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // User is attached to req by auth middleware
    const userId = req.user?.userId;

    if (!userId) {
        return next(new AppError("Not authenticated", 401));
    }

    const user = await authService.getUserById(userId);

    res.json({
        success: true,
        data: user
    });
});

/**
 * LOGOUT - POST /api/auth/logout
 * Note: With JWT, logout is handled client-side by removing the token
 * This endpoint exists for consistency and potential future server-side session management
 */
export const logout = asyncHandler(async (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: "Logged out successfully"
    });
});

/**
 * CHANGE PASSWORD - POST /api/auth/change-password
 */
export const changePassword = asyncHandler(async (req: any, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    // Check if user exists on request (from middleware)
    if (!req.user || !req.user.userId) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const userId = req.user.userId;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Current and new password are required"
        });
    }

    // Basic validation for new password
    if (newPassword.length < 8) {
        return res.status(400).json({
            success: false,
            message: "New password must be at least 8 characters"
        });
    }

    await authService.changePassword(userId, oldPassword, newPassword);

    res.json({
        success: true,
        message: "Password changed successfully"
    });
});
