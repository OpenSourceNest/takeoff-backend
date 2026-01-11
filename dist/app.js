"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const eventRoutes_1 = __importDefault(require("./src/routes/eventRoutes"));
console.log('Starting server...');
const prisma_1 = require("./src/lib/prisma");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
app.get("/", async (req, res) => {
    try {
        const count = await prisma_1.prisma.eventRegistration.count();
        res.json(count === 0
            ? "No registrations have been added yet."
            : `There are ${count} registrations in the database.`);
    }
    catch (error) {
        res.status(500).json({ error: String(error) });
    }
});
console.log('PORT:', PORT);
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:8080', '*'],
    credentials: true
}));
app.use(express_1.default.json());
app.use('/api/events', eventRoutes_1.default);
console.log('Routes configured');
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
