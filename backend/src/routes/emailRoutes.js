import express from 'express';
import { protect } from '../middleware/auth.js';
import { sendSigningLink } from '../controllers/emailController.js';

const router = express.Router();

router.post('/send-link/:signatureId', protect, sendSigningLink);

export default router;
