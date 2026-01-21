import { CorsOptions } from "cors";

const getAllowedOrigins = (): string[] => {
    // 1. If explicitly set in environment, always prioritize it
    if (process.env.ALLOWED_ORIGINS) {
        return process.env.ALLOWED_ORIGINS.split(",");
    }

    // 2. In Production, we do NOT want hardcoded fallbacks for security.
    // It must be provided via the environment variable.
    if (process.env.NODE_ENV === "production") {
        return [];
    }

    // 3. In Development, provide convenient defaults
    return [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:4500",
    ];
};

const allowedOrigins = getAllowedOrigins();

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
