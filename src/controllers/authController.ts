import { Request, Response } from "express";
import { loginSchema } from "../schemas/auth.schema.js";
import * as authService from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    // User is attached to req by auth middleware
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
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
