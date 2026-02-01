
import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService.js";
import { AppError } from "../utils/AppError.js";

/**
 * Extend Express Request to include user
 */
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                role: string;
            };
        }
    }
}

/**
 * Middleware to verify JWT token and authenticate user
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from Authorization header or cookies
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            throw new AppError("No token provided. Please log in.", 401);
        }

        // Verify token
        const decoded = authService.verifyToken(token);

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please log in again."
        });
    }
};

/**
 * Middleware to check if user has ADMIN role
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }

    next();
};
