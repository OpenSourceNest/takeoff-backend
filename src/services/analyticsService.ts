import { prisma } from "../lib/prisma.js";



/**
 * Get overall registration statistics including conversion rate
 */
export const getRegistrationStats = async () => {
    // DEBUG: Check prisma state
    console.log("DEBUG: Prisma Object:", !!prisma);

    // Get total registrations
    const totalRegistrations = await prisma.eventRegistration.count();

    // Get event details
    const events = await prisma.event.findMany({
        select: { targetCapacity: true }
    });
    const totalCapacity = events.reduce((sum: number, event: { targetCapacity: number }) => sum + (event.targetCapacity || 500), 0) || 500;

    // Calculate registrations for last 24h (Growth rate)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recentRegistrations = await prisma.eventRegistration.count({
        where: {
            createdAt: { gte: yesterday }
        }
    });

    // Get conversion rate stats
    const conversionStats = await getConversionRate();

    return {
        totalRegistrations,
        targetCapacity: totalCapacity,
        percentageFilled: Math.round((totalRegistrations / totalCapacity) * 100),
        recentRegistrations, // Growth in last 24h
        remainingSpots: Math.max(0, totalCapacity - totalRegistrations),
        ...conversionStats
    };
};

/**
 * Get registration velocity (registrations over time)
 * Groups by day for the specified range (default: last 30 days)
 */
export const getRegistrationVelocity = async (days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const registrations = await prisma.eventRegistration.groupBy({
        by: ['createdAt'],
        where: {
            createdAt: {
                gte: startDate
            }
        },
        _count: {
            _all: true
        }
    });

    // Post-process to group by date (YYYY-MM-DD) since Prisma groupBy extraction on date part is DB specific
    // Doing it in JS for DB compatibility (easier for MVP)
    const velocityMap = new Map<string, number>();

    // Initialize all days in range with 0
    for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        velocityMap.set(d.toISOString().split('T')[0], 0);
    }

    registrations.forEach(reg => {
        const dateKey = reg.createdAt.toISOString().split('T')[0];
        const current = velocityMap.get(dateKey) || 0;
        velocityMap.set(dateKey, current + reg._count._all);
    });

    // Convert map to array sorted by date
    return Array.from(velocityMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Track a page visit
 */
export const trackPageVisit = async (page: string, sessionId: string, ipAddress?: string, userAgent?: string, referrer?: string) => {
    return await prisma.pageVisit.create({
        data: {
            page,
            sessionId,
            ipAddress,
            userAgent,
            referrer
        }
    });
};

/**
 * Get conversion rate (registrations / unique visitors)
 */
export const getConversionRate = async () => {
    // Count total page visits to landing and register pages
    // We include '/' because that's the top of the funnel
    const totalVisits = await prisma.pageVisit.count({
        where: {
            page: { in: ['/', '/register'] }
        }
    });

    // Count unique sessions
    const uniqueVisitsData = await prisma.pageVisit.findMany({
        where: {
            page: { in: ['/', '/register'] }
        },
        select: {
            sessionId: true
        },
        distinct: ['sessionId']
    });
    const uniqueVisits = uniqueVisitsData.length;

    // Count registrations
    const totalRegistrations = await prisma.eventRegistration.count();

    // Calculate conversion rate
    const conversionRate = uniqueVisits > 0
        ? Number(((totalRegistrations / uniqueVisits) * 100).toFixed(2))
        : 0;

    return {
        conversionRate,
        totalVisits,
        uniqueVisits
    };
};


/**
 * Get demographics breakdown (Profession, Gender, Location, Referrals, Checkins, Open Source Knowledge)
 */
export const getDemographicsBreakdown = async () => {
    // Profession stats - handle array field by flattening
    const allRegistrations = await prisma.eventRegistration.findMany({
        select: {
            profession: true,
            gender: true,
            location: true,
            referralSource: true,
            status: true,
            checkedIn: true,
            openSourceKnowledge: true
        }
    });

    // Flatten professions array and count
    const professionMap = new Map<string, number>();
    allRegistrations.forEach(reg => {
        reg.profession.forEach(prof => {
            professionMap.set(prof, (professionMap.get(prof) || 0) + 1);
        });
    });
    const professions = Array.from(professionMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 professions

    // Gender stats
    const genderStats = await prisma.eventRegistration.groupBy({
        by: ['gender'],
        _count: {
            _all: true
        }
    });

    // Location stats
    const locationStats = await prisma.eventRegistration.groupBy({
        by: ['location'],
        _count: {
            _all: true
        },
        orderBy: {
            _count: {
                location: 'desc'
            }
        },
        take: 5 // Top 5 locations
    });

    // Referral source stats
    const referralStats = await prisma.eventRegistration.groupBy({
        by: ['referralSource'],
        _count: {
            _all: true
        }
    });

    // Status stats
    const statusStats = await prisma.eventRegistration.groupBy({
        by: ['status'],
        _count: {
            _all: true
        }
    });

    // Check-in stats
    const checkinStats = await prisma.eventRegistration.groupBy({
        by: ['checkedIn'],
        _count: {
            _all: true
        }
    });

    // Open Source Knowledge stats
    const knowledgeStats = await prisma.eventRegistration.groupBy({
        by: ['openSourceKnowledge'],
        _count: {
            _all: true
        }
    });

    // Calculate average
    const totalKnowledge = allRegistrations.reduce((sum, reg) => sum + reg.openSourceKnowledge, 0);
    const averageKnowledge = allRegistrations.length > 0
        ? (totalKnowledge / allRegistrations.length).toFixed(1)
        : '0.0';

    // Create distribution for 1-10 scale
    const knowledgeDistribution = Array.from({ length: 10 }, (_, i) => {
        const level = i + 1;
        const stat = knowledgeStats.find(s => s.openSourceKnowledge === level);
        return {
            name: level.toString(),
            value: stat?._count._all || 0
        };
    });

    return {
        professions,
        genders: genderStats.map(stat => ({
            name: stat.gender,
            value: stat._count._all
        })),
        locations: locationStats.map(stat => ({
            name: stat.location,
            value: stat._count._all
        })),
        referrals: referralStats.map(stat => ({
            name: stat.referralSource,
            value: stat._count._all
        })),
        statuses: statusStats.map(stat => ({
            name: stat.status,
            value: stat._count._all
        })),
        checkins: checkinStats.map(stat => ({
            name: stat.checkedIn ? 'Checked In' : 'Not Checked In',
            value: stat._count._all
        })),
        openSource: {
            average: averageKnowledge,
            distribution: knowledgeDistribution
        }
    };
};
