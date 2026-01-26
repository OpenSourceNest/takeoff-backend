import { prisma } from "../lib/prisma";
import { CreateEventRegistrationInput, UpdateEventRegistrationInput } from "../schemas/event.schema";

export const createRegistration = async (data: CreateEventRegistrationInput) => {
    return await prisma.eventRegistration.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
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
