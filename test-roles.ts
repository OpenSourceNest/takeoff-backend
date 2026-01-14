import { Role } from "./generated/prisma";

console.log("\n=== ROLE ENUM TEST ===");
console.log("Total roles available:", Object.keys(Role).length);
console.log("\nAll roles:");
Object.keys(Role).forEach((role, index) => {
    console.log(`${index + 1}. ${role}`);
});

// Test specific roles
console.log("\n=== Testing specific roles ===");
console.log("FULLSTACK_DEVELOPER exists:", Role.FULLSTACK_DEVELOPER);
console.log("BLOCKCHAIN_DEVELOPER exists:", Role.BLOCKCHAIN_DEVELOPER);
console.log("SMART_CONTRACT_DEVELOPER exists:", Role.SMART_CONTRACT_DEVELOPER);
