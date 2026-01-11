import { prisma } from '../src/lib/prisma';

const targetEmail = "okonkwomoses158@gmail.com";

async function testEmail() {
    console.log('\n═══════════════════════════════════════');
    console.log('   EMAIL INTEGRATION TEST');
    console.log('═══════════════════════════════════════\n');

    // Step 1: Cleanup
    console.log('🧹 Step 1: Cleaning up existing records...');
    try {
        const deleted = await prisma.eventRegistration.deleteMany({
            where: { email: targetEmail }
        });
        console.log(`   ✓ Deleted ${deleted.count} existing record(s)\n`);
    } catch (error) {
        console.log('   ℹ No existing records found\n');
    }

    // Step 2: Register
    console.log('🚀 Step 2: Sending registration request...');
    console.log('   Email:', targetEmail);
    console.log('\n📺 WATCH YOUR "npm run dev" TERMINAL FOR LOGS!\n');

    try {
        const response = await fetch('http://localhost:4500/api/events/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: "Moses",
                lastName: "Okonkwo",
                email: targetEmail,
                isCommunityMember: true,
                role: "DEVELOPER",
                location: "Lagos",
                openSourceKnowledge: "10"
            })
        });

        const result = await response.json();

        console.log('\n═══════════════════════════════════════');
        if (response.ok) {
            console.log('✅ REGISTRATION SUCCESSFUL!');
            console.log('═══════════════════════════════════════');
            console.log('User ID:', result.data.id);
            console.log('Email:', result.data.email);
            console.log('\n📧 WHAT TO CHECK NOW:');
            console.log('   1. Your inbox at: okonkwomoses158@gmail.com');
            console.log('   2. Your spam folder (if not in inbox)');
            console.log('   3. Your server logs should show:');
            console.log('      - "=== CREATE REGISTRATION CALLED ==="');
            console.log('      - "Email service called with: ..."');
            console.log('      - "SMTP Debug: { HOST: \'smtp.gmail.com\', ... }"');
            console.log('      - "Welcome email sent: <message-id>"');
        } else {
            console.log('❌ REGISTRATION FAILED');
            console.log('═══════════════════════════════════════');
            console.log('Error:', result.error);
        }
        console.log('═══════════════════════════════════════\n');
    } catch (error: any) {
        console.error('\n❌ REQUEST ERROR:', error.message);
    }
}

testEmail();
