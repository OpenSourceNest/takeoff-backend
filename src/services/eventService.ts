import { prisma } from "../lib/prisma";
import { CreateEventRegistrationInput, UpdateEventRegistrationInput } from "../schemas/event.schema";
import QRCode from 'qrcode';
import { AppError } from "../utils/AppError";
import { io } from "../../app";

export const getEventConfig = async () => {
    let event = await prisma.event.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    if (!event) {
        event = await prisma.event.create({
            data: {
                name: 'Takeoff by Open Source Nest',
                targetCapacity: 500,
                location: 'TBD',
                date: new Date(),
            }
        });
        console.log("Initialized default event config");
    }

    return event;
};

export const createRegistration = async (data: CreateEventRegistrationInput) => {
    // 1. Get Active Event
    const event = await getEventConfig();

    // 2. Check Capacity
    const currentCount = await prisma.eventRegistration.count({
        where: { eventId: event.id }
    });

    if (currentCount >= event.targetCapacity) {
        throw new AppError("Registration failed: Event has reached full capacity.", 400);
    }

    // 3. Create Registration linked to Event
    const registration = await prisma.eventRegistration.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            email: data.email,
            isCommunityMember: data.isCommunityMember,
            communityDetails: data.communityDetails || null,
            profession: data.profession,
            professionOther: data.professionOther || null,
            location: data.location,
            locationOther: data.locationOther || null,
            referralSource: data.referralSource,
            referralSourceOther: data.referralSourceOther || null,
            newsletterSub: data.newsletterSub,
            pipelineInterest: data.pipelineInterest,
            interests: data.interests || null,
            openSourceKnowledge: data.openSourceKnowledge,
            eventId: event.id // Link to active event
        },
    });

    // Emit event to dashboard
    io.emit("dashboard:update", { type: "new_registration", data: registration });

    return registration;
};

export const getAllRegistrations = async () => {
    return await prisma.eventRegistration.findMany({
        orderBy: { createdAt: "desc" },
    });
};

export const getRegistrationById = async (id: string) => {
    return await prisma.eventRegistration.findUnique({
        where: { id },
        include: { event: true }
    });
};

export const searchRegistrations = async (search: string) => {
    return await prisma.eventRegistration.findMany({
        where: {
            OR: [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ],
        },
    });
};

export const updateRegistration = async (id: string, data: UpdateEventRegistrationInput) => {
    return await prisma.eventRegistration.update({
        where: { id },
        data,
    });
};

/**
 * Update listener check-in status
 */
export const checkInAttendee = async (registrationId: string) => {
    const updated = await prisma.eventRegistration.update({
        where: { id: registrationId },
        data: {
            checkedIn: true,
            checkInTime: new Date()
        }
    });

    // Emit event to dashboard
    io.emit("dashboard:update", { type: "checkin", data: updated });

    return updated;
};

export const generateQRCode = async (registrationId: string) => {
    const registration = await prisma.eventRegistration.findUnique({
        where: { id: registrationId },
        include: { event: true } // Include event details for the QR payload
    });

    if (!registration) return null;

    // Payload can be just the ID, or a JSON string with more info
    const qrData = JSON.stringify({
        id: registration.id,
        name: `${registration.firstName} ${registration.lastName}`,
        event: registration.event?.name
    });

    // Generate Data URL (base64 image)
    return await QRCode.toDataURL(qrData);
};

export const updateEventConfig = async (id: string, capacity: number) => {
    // 1. Check current registrations
    const currentCount = await prisma.eventRegistration.count({
        where: { eventId: id }
    });

    // 2. Validate new capacity
    if (capacity < currentCount) {
        throw new AppError(`Cannot reduce capacity to ${capacity}. There are already ${currentCount} registered attendees.`, 400);
    }

    return await prisma.event.update({
        where: { id },
        data: { targetCapacity: capacity }
    });
};
