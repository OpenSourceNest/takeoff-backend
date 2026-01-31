import { prisma } from '../src/lib/prisma';

// const prisma = new PrismaClient();

async function main() {
    const count = await prisma.event.count();
    if (count === 0) {
        await prisma.event.create({
            data: {
                name: 'Takeoff by Open Source Nest',
                targetCapacity: 500,
                location: 'TBD',
                date: new Date(),
            }
        });
        console.log('✅ Default event created with capacity 500');
    } else {
        console.log('ℹ️ Event already exists, skipping seed.');
    }
}

main()
    .catch((e) => {
        console.error('Error Code:', (e as any).code);
        console.error('Error Message:', (e as any).message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
