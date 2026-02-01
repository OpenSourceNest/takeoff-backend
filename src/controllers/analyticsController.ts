import { Request, Response } from "express";
import * as analyticsService from "../services/analyticsService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

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

/**
 * POST - /api/analytics/track-visit
 * Track a page visit for conversion rate calculation
 */
export const trackVisit = asyncHandler(async (req: Request, res: Response) => {
    const { page, sessionId, ipAddress, userAgent, referrer } = req.body;
    console.log(`[Backend Analytics] Received track-visit:`, { page, sessionId, ipAddress, userAgent, referrer });

    if (!page || !sessionId) {
        throw new AppError('Page and sessionId are required', 400);
    }

    // Get IP and User Agent from headers if not provided in body
    const finalIp = ipAddress || req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const finalUserAgent = userAgent || req.headers['user-agent'];

    await analyticsService.trackPageVisit(page, sessionId, String(finalIp), String(finalUserAgent), referrer);

    res.json({
        success: true,
        message: 'Visit tracked successfully'
    });
});

/**
 * GET - /api/analytics/filtered
 * Returns filtered registrations based on query parameters
 * Query params: gender, profession, checkedIn, newsletterSub
 */
export const getFiltered = asyncHandler(async (req: Request, res: Response) => {
    const { gender, profession, checkedIn, newsletterSub } = req.query;

    // Parse filters
    interface FilterParams {
        gender?: string;
        profession?: string[];
        checkedIn?: boolean;
        newsletterSub?: boolean;
    }

    const filters: FilterParams = {};

    if (gender && gender !== 'all') {
        filters.gender = gender as string;
    }

    if (profession) {
        // Can be comma-separated string or array
        filters.profession = Array.isArray(profession)
            ? profession as string[]
            : (profession as string).split(',').filter(Boolean);
    }

    if (checkedIn !== undefined && checkedIn !== 'all') {
        filters.checkedIn = checkedIn === 'true';
    }

    if (newsletterSub !== undefined && newsletterSub !== 'all') {
        filters.newsletterSub = newsletterSub === 'true';
    }

    const data = await analyticsService.getFilteredRegistrations(filters);

    res.json({
        success: true,
        data
    });
});
