import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

// get current user router
router.get('/me', authMiddleware, getMe);

export default router;