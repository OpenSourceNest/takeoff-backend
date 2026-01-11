import "dotenv/config";
import express from "express";
import cors from "cors";
import eventRoutes from "./src/routes/eventRoutes";
import { prisma } from "./src/lib/prisma";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://takeoff.opensourcenest.org"]
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:8080",
      ];

app.use(express.json());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// TODO - Implement middleware for logging requests
app.get("/", async (req, res) => {
  console.log("Root endpoint hit!");
  try {
    const count = await prisma.eventRegistration.count();
    res.json(
      count === 0
        ? "No registrations have been added yet."
        : `There are ${count} registrations in the database.`
    );
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.use("/api/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
