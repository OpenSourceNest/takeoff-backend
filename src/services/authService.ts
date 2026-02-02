import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

/**
 * Register new user
 */
export const register = async (email: string, password: string) => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    });

    if (existingUser) {
        throw new AppError("User with this email already exists", 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with default role (defaults to USER in schema)
    const user = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            password: hashedPassword
        }
    });

    // Generate JWT token
    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        },
        token
    };
};

/**
 * Login admin user
 */
export const login = async (email: string, password: string) => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    });

    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    console.log(`[AuthService] Login attempt for user: ${email}, Role: ${user.role}`);

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid credentials", 401);
    }

    // Generate JWT token
    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        },
        token
    };
};

/**
 * Generate JWT token
 */
export const generateToken = (payload: { userId: string; email: string; role: string }) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Change user password
 */
export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    // Get user
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Verify old password
    const isPasswordValid = await comparePassword(oldPassword, user.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid current password", 400);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });

    return { message: "Password updated successfully" };
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        throw new AppError("Invalid or expired token", 401);
    }
};

/**
 * Hash password
 */
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
        }
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};
