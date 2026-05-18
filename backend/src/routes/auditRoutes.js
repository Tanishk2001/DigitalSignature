import express from 'express';
import { protect } from '../middleware/auth.js';
import { getAuditTrail, getUserAuditTrail } from '../controllers/auditController.js';

const router = express.Router();

router.get('/document/:documentId', protect, getAuditTrail);
router.get('/user/trail', protect, getUserAuditTrail);

export default router;
