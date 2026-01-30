import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

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

    // Check if user is admin
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
