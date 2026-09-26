import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import businessRoutes from './routes/business.routes';

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vypar Manch API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
