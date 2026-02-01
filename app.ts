import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import express from "express";
import { corsOptions } from "./src/config/cors";
import { prisma } from "./src/lib/prisma";
import { globalErrorHandler } from "./src/middleware/errorHandler";
import { requestLogger } from "./src/middleware/logger";
import eventRoutes from "./src/routes/eventRoutes";
import healthRoutes from "./src/routes/healthRoutes";
import authRoutes from "./src/routes/authRoutes";
import analyticsRoutes from "./src/routes/analyticsRoutes";
import { initMessenger } from "./src/lib/rabbitmq";

import { createServer } from "http";
import { initSocket } from "./src/lib/socket";

dotenv.config();
initMessenger();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
export const io = initSocket(httpServer);

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// TODO - Implement middleware for logging requests
app.use(requestLogger);
app.use(healthRoutes);

app.get("/", async (req, res) => {
  if (process.env.NODE_ENV === "development") {
    const count = await prisma.eventRegistration.count();
    res.json(
      count === 0
        ? "No registrations have been added yet."
        : `There are ${count} registrations in the database.`,
    );
  } else {
    res.json({ message: "Welcome to the Takeoff Backend API" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/events", eventRoutes);

// Global Error Handler
app.use(globalErrorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
