import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getDashboardData } from '../controllers/DashboardData.js';

const router = express.Router()

router.get('/dashboard' , authMiddleware, getDashboardData)

export default router;