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
        const secret = process.env.SECRETKEY;
        if (!secret) {
            console.error("SECRETKEY is not defined in environment variables.");
            return res.status(500).json({ message: "Internal server error." });
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.user = decoded;

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
