"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventRegistration = exports.updateEventRegistration = exports.getEventRegistrations = exports.createEventRegistration = void 0;
const prisma_1 = require("../lib/prisma");
const createEventRegistration = async (req, res) => {
    try {
        const { firstName, lastName, email, isCommunityMember, role, roleOther, location, locationOther, openSourceKnowledge } = req.body;
        const registration = await prisma_1.prisma.eventRegistration.create({
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
exports.createEventRegistration = createEventRegistration;
const getEventRegistrations = async (req, res) => {
    try {
        const registrations = await prisma_1.prisma.eventRegistration.findMany({
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
exports.getEventRegistrations = getEventRegistrations;
const updateEventRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.openSourceKnowledge) {
            updateData.openSourceKnowledge = parseInt(updateData.openSourceKnowledge);
        }
        const registration = await prisma_1.prisma.eventRegistration.update({
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
exports.updateEventRegistration = updateEventRegistration;
const deleteEventRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.eventRegistration.delete({
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
exports.deleteEventRegistration = deleteEventRegistration;
