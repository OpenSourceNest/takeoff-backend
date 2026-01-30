import { prisma } from "../lib/prisma.js";

interface DateRange {
    startDate?: Date;
    endDate?: Date;
}

/**
 * Get overall registration statistics
 */
export const getRegistrationStats = async () => {
    // DEBUG: Check prisma state
    console.log("DEBUG: Prisma Object:", !!prisma);
    console.log("DEBUG: Prisma Event Model:", !!prisma.event);

    // Get total registrations
    const totalRegistrations = await prisma.eventRegistration.count();

    // Get event details
    const events = await prisma.event.findMany({
        select: { targetCapacity: true }
    });

    const totalCapacity = events.reduce((sum: number, event: any) => sum + (event.targetCapacity || 500), 0) || 500; // Default to 500 if no events

    // Calculate registrations for last 24h (Growth rate)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recentRegistrations = await prisma.eventRegistration.count({
        where: {
            createdAt: { gte: yesterday }
        }
    });

    return {
        totalRegistrations,
        targetCapacity: totalCapacity,
        percentageFilled: Math.round((totalRegistrations / totalCapacity) * 100),
        recentRegistrations, // Growth in last 24h
        remainingSpots: Math.max(0, totalCapacity - totalRegistrations)
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
 * Get demographics breakdown (Profession & Location implicitly if valid)
 */
export const getDemographicsBreakdown = async () => {
    const professionStats = await prisma.eventRegistration.groupBy({
        by: ['profession'],
        _count: {
            _all: true
        },
        orderBy: {
            _count: {
                profession: 'desc'
            }
        },
        take: 5 // Top 5 professions
    });

    // Since we don't have a specific 'location/country' field in schema based on my last read,
    // we'll stick to profession for now. If gender was added, we use that.

    const genderStats = await prisma.eventRegistration.groupBy({
        by: ['gender'],
        _count: {
            _all: true
        }
    });

    return {
        professions: professionStats.map(stat => ({
            name: stat.profession,
            value: stat._count._all
        })),
        genders: genderStats.map(stat => ({
            name: stat.gender,
            value: stat._count._all
        }))
    };
};
