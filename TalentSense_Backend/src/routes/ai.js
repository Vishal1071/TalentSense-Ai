import express from "express";
import { matchJobDescription } from "../controllers/aiController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/match-jd', authMiddleware, matchJobDescription);

export default router;