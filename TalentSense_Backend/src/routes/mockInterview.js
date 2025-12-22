import express from "express";
import {
  startInterview,
  answerQuestion,
  endInterview,
} from "../controllers/mockInterviewController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/start', authMiddleware, startInterview);
router.post('/answer', authMiddleware, answerQuestion);
router.post('/end', authMiddleware, endInterview);

export default router;