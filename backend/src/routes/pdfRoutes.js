import express from 'express';
import { protect } from '../middleware/auth.js';
import { generateSignedPDF, downloadDocument } from '../controllers/pdfController.js';

const router = express.Router();

router.post('/generate-signed/:documentId', protect, generateSignedPDF);
router.get('/download/:documentId', protect, downloadDocument);

export default router;
