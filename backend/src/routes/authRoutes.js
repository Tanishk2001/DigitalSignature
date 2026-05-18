import express from 'express';
import { register, login } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected route example
router.get('/me', protect, (req, res) => {
  res.json({ message: 'Protected route accessed', userId: req.userId });
});

export default router;
