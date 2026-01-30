import express from "express";
import { prisma } from "../lib/prisma";
import { getChannel, REGISTRATION_QUEUE_NAME } from "../lib/rabbitmq";

const router = express.Router();

router.get("/ready", async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    checks: [],
  };

  try {
    const results = await Promise.allSettled([
      prisma.$queryRaw`SELECT 1`,
      getChannel().checkQueue(REGISTRATION_QUEUE_NAME),
    ]);

    const isHealthy = results.every((r) => r.status === "fulfilled");

    if (!isHealthy) {
      return res.status(503).json({ ...healthcheck, message: "Degraded" });
    }

    res.status(200).send(healthcheck);
  } catch (error) {
    console.log(error);

    res.status(503).send({ message: "Check server logs" });
  }
});

export default router;
