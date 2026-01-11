// Test email functionality with a fresh registration
export { }; // Make this a module to avoid global scope conflicts

// const testEmail = `okonkwomoses158+test${Date.now()}@gmail.com`;
const testEmail = "francis@opensourcenest.org";
const testData = {
    firstName: "Test",
    lastName: "User",
    email: testEmail,
    isCommunityMember: true,
    role: "DEVELOPER",
    location: "Lagos",
    openSourceKnowledge: "8"
};

async function testEmailSending() {
    console.log(`\n🧪 Testing email with: ${testEmail}\n`);

    try {
        const response = await fetch('http://localhost:4500/api/events/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        if (response.ok) {
            // console.log('✅ Registration successful!');
            console.log('📋 User ID:', result.data.id);
            // console.log('\n📧 Check your inbox at: okonkwomoses158@gmail.com');
            // console.log('📝 Also check your server console for: "Welcome email sent: ..."');
        } else {
            console.error('❌ Registration failed:', result);
        }
    } catch (error: any) {
        console.error('❌ Request error:', error);
    }
}

testEmailSending();
