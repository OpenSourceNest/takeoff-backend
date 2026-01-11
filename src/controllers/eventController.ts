import { prisma } from '../lib/prisma';
import { Request, Response } from 'express';

export const createEventRegistration = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      isCommunityMember,
      role,
      roleOther,
      location,
      locationOther,
      openSourceKnowledge
    } = req.body;

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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getEventRegistrations = async (req: Request, res: Response) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: registrations
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateEventRegistration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteEventRegistration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    await prisma.eventRegistration.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};