
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🔍 Starting Prisma Diagnostic...");

    try {
        // 1. Check connection
        console.log("1. Testing connection...");
        await prisma.$connect();
        console.log("✅ Connected to database.");

        // 2. Check Event Model
        console.log("2. Checking Event model...");
        if (!prisma.event) {
            throw new Error("❌ prisma.event is UNDEFINED. Client generation issue?");
        }
        console.log("✅ prisma.event is defined.");

        // 3. Count Events
        console.log("3. Counting events...");
        const count = await prisma.event.count();
        console.log(`✅ Found ${count} events.`);

        // 4. Create Test Event if none
        if (count === 0) {
            console.log("4. Creating test event...");
            const newEvent = await prisma.event.create({
                data: {
                    name: "Test Event",
                    date: new Date(),
                    location: "Test Loc",
                    targetCapacity: 100
                }
            });
            console.log("✅ Created event:", newEvent.id);
        }

        console.log("🎉 DIAGNOSTIC PASSED!");
    } catch (error) {
        console.error("❌ DIAGNOSTIC FAILED:", JSON.stringify(error, null, 2));
    } finally {
        await prisma.$disconnect();
    }
}

main();
