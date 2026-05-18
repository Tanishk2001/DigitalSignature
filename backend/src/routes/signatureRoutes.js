import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  saveSignature,
  getSignatures,
  updateSignatureStatus,
  generateSigningToken,
} from '../controllers/signatureController.js';

const router = express.Router();

router.post('/save', protect, saveSignature);
router.get('/:documentId', protect, getSignatures);
router.patch('/:signatureId', protect, updateSignatureStatus);
router.post('/token/generate', protect, generateSigningToken);

export default router;
