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

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// TODO - Implement middleware for logging requests
app.use(requestLogger);

app.get("/", async (req, res) => {
  console.log("Root endpoint hit!");
  try {
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
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.use("/api/events", eventRoutes);

// Global Error Handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
