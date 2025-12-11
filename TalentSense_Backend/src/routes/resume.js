import express from "express";
import { uploadResume } from "../controllers/resumeController.js";
import { upload } from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);


export default router;