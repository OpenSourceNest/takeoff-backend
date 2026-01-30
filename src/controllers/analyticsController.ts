import { Request, Response } from "express";
import * as analyticsService from "../services/analyticsService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET - /api/events/analytics/overview
 * Returns high-level stats for dashboard cards
 */
// Wrapped in manual try-catch for debugging 500 error
export const getOverview = async (req: Request, res: Response) => {
    try {
        const stats = await analyticsService.getRegistrationStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        console.error("Analytics Overview Error:", error);
        // Explicitly construct valid JSON response for Error object
        res.status(500).json({
            success: false,
            message: error?.message || "Unknown error occurred",
            stack: error?.stack || null
        });
    }
};

/**
 * GET - /api/events/analytics/velocity
 * Returns timeseries data for charts
 */
export const getVelocity = asyncHandler(async (req: Request, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const velocity = await analyticsService.getRegistrationVelocity(days);
    res.json({
        success: true,
        data: velocity
    });
});

/**
 * GET - /api/events/analytics/demographics
 * Returns pie/bar chart data for breakdown
 */
export const getDemographics = asyncHandler(async (req: Request, res: Response) => {
    const demographics = await analyticsService.getDemographicsBreakdown();
    res.json({
        success: true,
        data: demographics
    });
});
