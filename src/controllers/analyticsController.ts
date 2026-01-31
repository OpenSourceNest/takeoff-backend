import { Request, Response } from "express";
import * as analyticsService from "../services/analyticsService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET - /api/events/analytics/overview
 * Returns high-level stats for dashboard cards
 */
/**
 * GET - /api/events/analytics/overview
 * Returns high-level stats for dashboard cards
 */
export const getOverview = asyncHandler(async (req: Request, res: Response) => {
    const stats = await analyticsService.getRegistrationStats();
    res.json({
        success: true,
        data: stats
    });
});

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
