import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    role: string;
    [key: string]: unknown;
}

export const authorize = (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token)
        return res
            .status(403)
            .json({ message: "Access denied. No token provided." });

    try {
        const secret = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

        const decoded = jwt.verify(token, secret) as JwtPayload;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.user = decoded as any;

        if (!allowedRoles.includes(decoded.role)) {
            return res
                .status(403)
                .json({ message: "Access denied. Insufficient permissions." });
        }

        next();
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.log("Token verification error:", message);
        if (err instanceof Error && err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(400).json({ message: "Invalid token" });
    }
};
