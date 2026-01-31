import "dotenv/config";
import { login } from '../src/services/authService';

async function main() {
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Defined" : "UNDEFINED");
    try {
        console.log("Attempting login...");
        const result = await login("admin@takeoff.com", "Admin@123");
        console.log("Login successful:", result);
    } catch (error) {
        console.error("Login failed:", error);
    }
}

main();
