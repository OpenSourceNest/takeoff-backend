import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { z } from "zod";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        console.error("ERROR 💥", err);
    }

    // Handle Zod Validation Errors
    if (err instanceof z.ZodError) {
        return res.status(400).json({
            status: "fail",
            message: err.issues[0].message,
            validationErrors: err.issues,
        });
    }

    // Handle Prisma Unique Constraint Errors
    if (err.code === "P2002") {
        return res.status(409).json({
            status: "fail",
            message: `Duplicate value for field: ${err.meta?.target}`,
        });
    }

    // Handle Prisma Record Not Found
    if (err.code === "P2025") {
        return res.status(404).json({
            status: "fail",
            message: "Record not found",
        });
    }

    // Handle AppError (Operational)
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false, // Maintain backward compatibility with current success: false format if desired, or switch to status: fail
            status: err.status,
            error: err.message,
        });
    }

    // Send Generic Response for Unknown Errors
    // Only show detailed error in development
    res.status(500).json({
        success: false,
        status: "error",
        error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong!",
    });
};
