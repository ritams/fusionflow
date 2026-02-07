import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fusionflow')
  .then(() => logger.db('Connected to MongoDB'))
  .catch((err) => logger.error('MongoDB connection failed', { context: 'DB', data: { error: String(err) } }));

import userRoutes from './routes/user';
import assetRoutes from './routes/assets';
import generateRoutes from './routes/generate';
import uploadRoutes from './routes/upload';
import path from 'path';

// Serve static files from public/uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/health', (req, res) => {
  res.send('OK');
});

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});
