import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import resumeRouter from './routes/resume.js'
import aiRoutes from './routes/ai.js';
import mockInterviewRoutes from './routes/mockInterview.js'

dotenv.config();
await connectDB();

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRouter);
app.use('/api/ai', aiRoutes);
app.use('/api/ai/mock-interview', mockInterviewRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})