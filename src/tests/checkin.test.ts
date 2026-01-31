import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { prisma } from "../lib/prisma";

// Mock Prisma
vi.mock("../lib/prisma", () => ({
    prisma: {
        eventRegistration: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    },
}));

// Mock Authorize Middleware
vi.mock("../middleware/authorize", () => ({
    authorize: () => (req: any, res: any, next: any) => next(),
}));

describe("Check-in and QR Routes", () => {
    beforeAll(() => {
        vi.clearAllMocks();
    });

    describe("POST /api/events/registrations/:id/checkin", () => {
        it("should check in an attendee successfully", async () => {
            const mockId = "123";
            const mockRegistration = {
                id: mockId,
                firstName: "John",
                lastName: "Doe",
                checkedIn: false
            };

            (prisma.eventRegistration.findUnique as any).mockResolvedValue(mockRegistration);
            (prisma.eventRegistration.update as any).mockResolvedValue({
                ...mockRegistration,
                checkedIn: true,
                checkInTime: new Date()
            });

            const response = await request(app)
                .post(`/api/events/registrations/${mockId}/checkin`)
                .send();

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Attendee checked in successfully.");
            expect(response.body.data.checkedIn).toBe(true);
        });

        it("should return 404 if registration not found", async () => {
            (prisma.eventRegistration.findUnique as any).mockResolvedValue(null);

            const response = await request(app)
                .post("/api/events/registrations/nonexistent/checkin")
                .send();

            expect(response.status).toBe(404);
            expect(response.body.error).toContain("Registration not found");
        });
    });

    describe("GET /api/events/registrations/:id/qr", () => {
        it("should return a QR code successfully", async () => {
            const mockId = "123";
            const mockRegistration = {
                id: mockId,
                firstName: "John",
                lastName: "Doe",
                event: { name: "Test Event" }
            };

            (prisma.eventRegistration.findUnique as any).mockResolvedValue(mockRegistration);

            const response = await request(app)
                .get(`/api/events/registrations/${mockId}/qr`)
                .send();

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.qrCode).toBeDefined();
            expect(response.body.qrCode).toContain("data:image/png;base64");
        });
    });
});
