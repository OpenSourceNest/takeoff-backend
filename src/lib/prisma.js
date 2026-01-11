import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
let prisma;
try {
    prisma = new PrismaClient({ adapter });
}
catch (e) {
    console.error('Failed to initialize PrismaClient:', e);
    process.exit(1);
}
export { prisma };
