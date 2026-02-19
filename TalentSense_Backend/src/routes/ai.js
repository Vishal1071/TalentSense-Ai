import express from "express";
import { matchJobDescription } from "../controllers/aiController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post('/match-jd', authMiddleware, upload.single("resume"), matchJobDescription);

export default router;