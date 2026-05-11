import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth.route';
import boardRoutes from './routes/board.route';
import taskRoutes from './routes/task.route';
import http from "http";
import { initSocket } from "./socket";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Daftarkan Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);

const server = http.createServer(app);
initSocket(server);

// ✅ Pakai server.listen, bukan app.listen
server.listen(PORT, () => {
  console.log(`🚀 Tasklify API running on http://localhost:${PORT}`);
});