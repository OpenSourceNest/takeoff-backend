import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const registrations = await prisma.eventRegistration.count();
    const events = await prisma.event.findMany();
    const totalCapacity = events.reduce((sum, event) => sum + (event.targetCapacity || 500), 0) || 500;

    console.log('--- DATABASE STATE ---');
    console.log('Registrations:', registrations);
    console.log('Events Found:', events.length);
    events.forEach((e, i) => console.log(`Event ${i}:`, e.name, 'Capacity:', e.targetCapacity));
    console.log('Calculated Total Capacity:', totalCapacity);
    console.log('Percentage Calculation: (', registrations, '/', totalCapacity, ') * 100 =', (registrations / totalCapacity) * 100);
    console.log('Percentage toFixed(3):', ((registrations / totalCapacity) * 100).toFixed(3));
    console.log('-----------------------');
}

main().catch(console.error).finally(() => prisma.$disconnect());
