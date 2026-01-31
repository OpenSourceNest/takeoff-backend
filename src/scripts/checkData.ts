
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const registrations = await prisma.eventRegistration.findMany({
        select: {
            id: true,
            openSourceKnowledge: true,
            createdAt: true
        }
    });

    console.log('Total Registrations:', registrations.length);
    console.log('Open Source Knowledge Values:', registrations.map(r => r.openSourceKnowledge));

    if (registrations.length > 0) {
        const total = registrations.reduce((sum, r) => sum + r.openSourceKnowledge, 0);
        const avg = total / registrations.length;
        console.log('Calculated Average:', avg);
    } else {
        console.log('No registrations found.');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
