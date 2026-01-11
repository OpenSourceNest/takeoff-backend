"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../../generated/prisma/client");
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
let prisma;
try {
    exports.prisma = prisma = new client_1.PrismaClient({ adapter });
}
catch (e) {
    console.error('Failed to initialize PrismaClient:', e);
    process.exit(1);
}
