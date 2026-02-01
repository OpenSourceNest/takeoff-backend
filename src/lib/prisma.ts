import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 30000, // 30 seconds
  idleTimeoutMillis: 30000,
  max: 10 // Limiting connections to avoid overloading remote host
});
const adapter = new PrismaPg(pool);
let prisma: PrismaClient;
try {
  prisma = new PrismaClient({ adapter });
} catch (e) {
  console.error("Failed to initialize PrismaClient:", e);
  process.exit(1);
}

export { prisma };
