import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

async function main() {
    console.log('Starting verification with pg driver...');

    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is missing');
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        const insertQuery = `
      INSERT INTO event_registrations (
        id, "firstName", "lastName", email, "isCommunityMember", "openSourceKnowledge", 
        profession, "referralSource", "newsletterSub", "pipelineInterest", interests, "communityDetails", "createdAt", location
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 
        $7, $8, $9, $10, $11, $12, NOW(), $13
      ) RETURNING *;
    `;

        const values = [
            'test-id-' + Date.now(),
            'TestPG',
            'UserPG',
            `test.pg.${Date.now()}@example.com`,
            true,
            9,
            ['PROFESSIONAL_DEVELOPER', 'BACKEND_DEVELOPER'],
            'ONLINE_SEARCH', // Enum value
            true,
            'YES', // Enum value
            'Postgres direct',
            'PG Community',
            'Remote'
        ];

        console.log('Executing INSERT...');
        const res = await client.query(insertQuery, values);
        const row = res.rows[0];
        console.log('Inserted Row:', row);

        // Verify fields
        if (row.profession !== 'PROFESSIONAL_DEVELOPER') throw new Error('Profession mismatch: ' + row.profession);
        if (row.referralSource !== 'ONLINE_SEARCH') throw new Error('referralSource mismatch: ' + row.referralSource);
        if (row.pipelineInterest !== 'YES') throw new Error('pipelineInterest mismatch: ' + row.pipelineInterest);

        console.log('Verification SUCCESS!');

        // Cleanup
        await client.query('DELETE FROM event_registrations WHERE id = $1', [row.id]);
        console.log('Cleanup successful.');

    } catch (err) {
        console.error('Verification FAILED:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
