import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './src/config/database.js';
import authRoutes from './src/routes/authRoutes.js';
import documentRoutes from './src/routes/documentRoutes.js';
import signatureRoutes from './src/routes/signatureRoutes.js';
import auditRoutes from './src/routes/auditRoutes.js';
import pdfRoutes from './src/routes/pdfRoutes.js';
import emailRoutes from './src/routes/emailRoutes.js';
import auditMiddleware from './src/middleware/audit.js';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Audit middleware attaches req.auditLog helper
app.use(auditMiddleware);

// Connect Database
connectDB();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: '✅ Digital Signature API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/signatures', signatureRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/email', emailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
