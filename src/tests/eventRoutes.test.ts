import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { prisma } from "../lib/prisma";

// Mock Prisma
vi.mock("../lib/prisma", () => ({
    prisma: {
        eventRegistration: {
            create: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            count: vi.fn(),
        },
    },
}));

// Mock Email Service (if you have one, currently it's just a comment in controller)
// vi.mock("../utils/mail.util", () => ({ SendMail: vi.fn() }));

describe("Event Routes", () => {
    beforeAll(() => {
        vi.clearAllMocks();
    });

    describe("POST /api/events/register", () => {
        it("should register a new user successfully", async () => {
            const mockData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                isCommunityMember: false,
                profession: ["PROFESSIONAL_DEVELOPER"],
                location: "New York",
                referralSource: "SOCIAL_MEDIA",
                newsletterSub: true,
                pipelineInterest: "YES",
                openSourceKnowledge: 5,
            };

            // Mock Prisma return value
            (prisma.eventRegistration.create as any).mockResolvedValue({
                id: "123",
                ...mockData,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response = await request(app)
                .post("/api/events/register")
                .send(mockData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(mockData.email);
        });

        it("should fail with validation error when required fields are missing", async () => {
            const invalidData = {
                firstName: "John",
                // lastName missing
                email: "invalid-email", // invalid email
            };

            const response = await request(app)
                .post("/api/events/register")
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body.status).toBe("fail");
            expect(response.body.validationErrors).toBeDefined();
        });
    });
});
