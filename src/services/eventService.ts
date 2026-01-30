import { prisma } from "../lib/prisma";
import { CreateEventRegistrationInput, UpdateEventRegistrationInput } from "../schemas/event.schema";
import QRCode from 'qrcode';

export const createRegistration = async (data: CreateEventRegistrationInput) => {
    return await prisma.eventRegistration.create({
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
        },
    });
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
// ... existing checkInAttendee function ...
export const checkInAttendee = async (registrationId: string) => {
    return await prisma.eventRegistration.update({
        where: { id: registrationId },
        data: {
            checkedIn: true,
            checkInTime: new Date()
        }
    });
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
