/**
 * Test script for event registration endpoint
 */
import fetch from "node-fetch";

const testRegistration = async () => {
    const registrationData = {
        firstName: "Francis",
        lastName: "OpenSource",
        email: "mosesjohnson706@gmail.com",
        isCommunityMember: true,
        communityDetails: "Takeoff Community",
        profession: ["FULLSTACK_DEVELOPER", "DEVOPS_ENGINEER"],
        professionOther: null,
        location: "Remote",
        locationOther: null,
        referralSource: "FRIEND_COLLEAGUE",
        newsletterSub: true,
        pipelineInterest: "YES",
        interests: "Blockchain, AI",
        openSourceKnowledge: 9,
    };

    try {
        const response = await fetch("http://localhost:4500/api/events/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registrationData),
        });

        const data = await response.json();

        console.log("\n=== TEST RESULTS ===");
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log("\n✅ Registration successful!");
            console.log("Email should be sent to:", registrationData.email);
        } else {
            console.log("\n❌ Registration failed!");
        }
    } catch (error) {
        console.error("\n❌ Error:", error);
    }
};

testRegistration();
