import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import eventRoutes from './src/routes/eventRoutes';

console.log('Starting server...');
import { prisma } from './src/lib/prisma';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.get("/", async (req, res) => {
  try {
    const count = await prisma.eventRegistration.count();
    res.json(
      count === 0
        ? "No registrations have been added yet."
        : `There are ${count} registrations in the database.`
    );
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});
console.log('PORT:', PORT);

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:8080', '*'],
  credentials: true
}));
app.use(express.json());

app.use('/api/events', eventRoutes);
console.log('Routes configured');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;