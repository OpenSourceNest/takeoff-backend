import { prisma } from '../lib/prisma';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

export const createEventRegistration = async (req: Request, res: Response) => {
  console.log('=== REGISTRATION ENDPOINT HIT ===');
  console.log('Request received:', req.method, req.url);
  
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

    // Basic validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'First name, last name, and email are required.'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format.'
      });
    }

    const knowledge = parseInt(openSourceKnowledge);
    if (isNaN(knowledge) || knowledge < 1 || knowledge > 10) {
      return res.status(400).json({
        success: false,
        error: 'Open source knowledge must be between 1 and 10.'
      });
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        isCommunityMember,
        role,
        roleOther: roleOther?.trim() || null,
        location: location?.trim(),
        locationOther: locationOther?.trim() || null,
        openSourceKnowledge: knowledge
      }
    });

    // Send email after successful registration
    console.log('About to send email to:', email);
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? 'SET' : 'NOT SET',
      pass: process.env.SMTP_PASS ? 'SET' : 'NOT SET'
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: Number(process.env.SMTP_TIMEOUT) || 60000
    });

    try {
      const info = await transporter.sendMail({
        from: `"Takeoff" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Welcome to Takeoff Event!",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Welcome, ${firstName}!</h1>
            <p>Thank you for registering for the Takeoff event.</p>
            <p>We are excited to see you there.</p>
            <br>
            <p>Best regards,</p>
            <p>The Takeoff Team</p>
          </div>
        `,
      });
      console.log('Email sent successfully! Message ID:', info.messageId);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      data: registration
    });
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({
        success: false,
        error: 'This email address is already registered.'
      });
    }

    res.status(400).json({
      success: false,
      error: error.message || 'An error occurred during registration.'
    });
  }
};

/**
 * GET ALL REGISTRATIONS
 */
export const getEventRegistrations = async (_req: Request, res: Response) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: registrations
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registrations.'
    });
  }
};

/**
 * UPDATE REGISTRATION
 */
export const updateEventRegistration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const updateData = { ...req.body };

    if (updateData.openSourceKnowledge) {
      updateData.openSourceKnowledge = parseInt(updateData.openSourceKnowledge, 10);
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
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Registration not found.'
      });
    }

    res.status(400).json({
      success: false,
      error: 'Failed to update registration.'
    });
  }
};

/**
 * DELETE REGISTRATION
 */
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
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Registration not found.'
      });
    }

    res.status(400).json({
      success: false,
      error: 'Failed to delete registration.'
    });
  }
};
