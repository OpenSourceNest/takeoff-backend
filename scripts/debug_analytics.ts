
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("Checking Analytics Data...");

    const totalRegistrations = await prisma.eventRegistration.count();
    console.log(`Total Registrations: ${totalRegistrations}`);

    const events = await prisma.event.findMany({
        select: { id: true, name: true, targetCapacity: true }
    });

    console.log(`Events found: ${events.length}`);
    events.forEach(e => {
        console.log(`- Event: ${e.name} (Capacity: ${e.targetCapacity})`);
    });

    const totalCapacity = events.reduce((sum, e) => sum + (e.targetCapacity || 500), 0) || 500;
    console.log(`Total Capacity Calculated: ${totalCapacity}`);

    const percentage = Math.round((totalRegistrations / totalCapacity) * 100);
    console.log(`Percentage Filled: ${percentage}%`);

    const percentageDetails = (totalRegistrations / totalCapacity) * 100;
    console.log(`Exact Percentage: ${percentageDetails}%`);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
