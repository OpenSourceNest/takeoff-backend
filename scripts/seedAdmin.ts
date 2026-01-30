import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/services/authService.js";

async function seedAdmin() {
    try {
        console.log("🌱 Seeding admin user...");

        const adminEmail = "admin@takeoff.com";
        const adminPassword = "Admin@123"; // Change this password!

        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log("✅ Admin user already exists:", adminEmail);
            return;
        }

        // Hash password
        const hashedPassword = await hashPassword(adminPassword);

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN"
            }
        });

        console.log("✅ Admin user created successfully!");
        console.log("📧 Email:", adminEmail);
        console.log("🔑 Password:", adminPassword);
        console.log("⚠️  IMPORTANT: Change this password after first login!");

    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();
