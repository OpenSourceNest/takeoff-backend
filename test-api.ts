
import fetch from "node-fetch";

async function testRegister() {
    const url = "http://localhost:4500/api/events/register";

    // Valid payload based on schema
    const payload = {
        firstName: "Test",
        lastName: "User",
        email: `test.user.${Date.now()}@example.com`,
        isCommunityMember: true,
        profession: ["BACKEND_DEVELOPER", "STUDENT"], // Array as expected now
        location: "Lagos",
        referralSource: "SOCIAL_MEDIA",
        newsletterSub: true,
        pipelineInterest: "YES",
        openSourceKnowledge: 8
    };

    try {
        console.log("Sending request to", url);
        console.log("Payload:", JSON.stringify(payload, null, 2));

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        console.log("Response Status:", response.status);
        console.log("Response Body:", JSON.stringify(data, null, 2));

        if (response.status === 201) {
            console.log("✅ Test Passed: Registration successful");
        } else {
            console.log("❌ Test Failed: Unexpected status code");
        }

    } catch (error) {
        console.error("❌ Test Failed: Error sending request", error);
    }
}

testRegister();
