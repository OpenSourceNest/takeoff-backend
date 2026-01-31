
import "dotenv/config";
import { login } from '../src/services/authService';

async function main() {
    try {
        // 1. Login to get token (using service directly to simulate valid token generation, 
        // essentially bypassing http login to get a valid token for the http request if needed, 
        // BUT ideally we should hit the http endpoint for login too. 
        // Let's use fetch for everything to test the SERVER).

        console.log("1. Logging in via HTTP...");
        const loginRes = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@takeoff.com", password: "Admin@123" })
        });

        if (!loginRes.ok) {
            console.error("Login HTTP failed:", await loginRes.text());
            return;
        }

        const loginData = await loginRes.json();
        console.log("Login success. Token:", loginData.data.token ? "Received" : "Missing");
        const token = loginData.data.token;

        // 2. Fetch Registrations
        console.log("\n2. Fetching Registrations via HTTP...");
        const regRes = await fetch("http://localhost:3000/api/events/registrations", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!regRes.ok) {
            console.error("Fetch Registrations failed:", await regRes.text());
            return;
        }

        const regData = await regRes.json();
        console.log("Registrations Response:", JSON.stringify(regData, null, 2));

    } catch (error) {
        console.error("Error:", error);
    }
}

main();
