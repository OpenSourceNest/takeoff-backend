// Quick email test

const testEmail = `okonkwomoses158+verify${Date.now()}@gmail.com`;

async function quickTest() {
    console.log('\n🚀 Sending registration request...\n');
    console.log('📧 Email:', testEmail);
    console.log('\n⏳ Watch your "npm run dev" terminal for detailed logs...\n');

    try {
        const response = await fetch('http://localhost:4500/api/events/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: "Quick",
                lastName: "Test",
                email: testEmail,
                isCommunityMember: true,
                role: "DEVELOPER",
                location: "Test",
                openSourceKnowledge: "7"
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log('\n✅ SUCCESS! Registration created.');
            console.log('👀 Now check your SERVER CONSOLE for these logs:');
            console.log('   - "=== CREATE REGISTRATION CALLED ==="');
            console.log('   - "Registration created: [ID]"');
            console.log('   - "Email service called with: ..."');
            console.log('   - "SMTP Debug: ..."');
            console.log('   - "Welcome email sent: ..."');
        } else {
            console.log('\n❌ Failed:', result);
        }
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

quickTest();
