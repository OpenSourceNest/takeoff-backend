import { prisma } from '../lib/prisma';
export const createEventRegistration = async (req, res) => {
    try {
        const { firstName, lastName, email, isCommunityMember, role, roleOther, location, locationOther, openSourceKnowledge } = req.body;
        const registration = await prisma.eventRegistration.create({
            data: {
                firstName,
                lastName,
                email,
                isCommunityMember,
                role,
                roleOther,
                location,
                locationOther,
                openSourceKnowledge: parseInt(openSourceKnowledge)
            }
        });
        res.status(201).json({
            success: true,
            data: registration
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
export const getEventRegistrations = async (req, res) => {
    try {
        const registrations = await prisma.eventRegistration.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            data: registrations
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
export const updateEventRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.openSourceKnowledge) {
            updateData.openSourceKnowledge = parseInt(updateData.openSourceKnowledge);
        }
        const registration = await prisma.eventRegistration.update({
            where: { id },
            data: updateData
        });
        res.json({
            success: true,
            data: registration
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
export const deleteEventRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.eventRegistration.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Registration deleted successfully'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
