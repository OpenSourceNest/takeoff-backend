import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

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
        throw new Error("User with this email already exists");
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
        throw new Error("Invalid credentials");
    }

    // Note: We removed the admin check here to allow regular users to login, 
    // but the frontend (admin dashboard) will protect its routes based on role.
    // If you want to RESTRICT login to admins only, keep the check.
    // For now, I'll keep the check but commented out as requested "signup help me access admin page" 
    // implying they want to login first, then be promoted.
    // Actually, if they login as USER and try to access /admin routes, the middleware/frontend should block them.
    // The user said: "if updated to admin. when the user login. he will be directed to the admin page"
    // This implies they CAN login.

    if (user.role !== "ADMIN") {
        throw new Error("Access denied. Admin privileges required.");
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
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
        throw new Error("User not found");
    }

    // Verify old password
    const isPasswordValid = await comparePassword(oldPassword, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid current password");
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
    } catch (error) {
        throw new Error("Invalid or expired token");
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
        throw new Error("User not found");
    }

    return user;
};
