
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
    try {
        const count = await prisma.eventRegistration.count();
        console.log(`Total Registrations: ${count}`);

        const regs = await prisma.eventRegistration.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { event: true } // Check relation too
        });

        console.log("Sample Registrations:", JSON.stringify(regs, null, 2));
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
