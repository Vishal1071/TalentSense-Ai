import cloudinary from "../config/cloudinary.js";
import ResumeReport from "../models/ResumeReport.js";
import { extractTextFromFile } from "../utils/parser.js";
import { generateAIReport } from "../utils/ai.js";
import { detectRoleFromResume } from '../utils/roleDetect.js'
import { calculateATSScore } from '../utils/ats.js'

export const uploadResume = async (req, res, next) => {
    try {

        if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

        //1. upload file to Cloudinary
        const upload = await cloudinary.uploader.upload(req.file.path, {
            folder: "TalentSense/resumes",
            resource_type: "raw",
        });

        //2. Extract text from file
        const parsedText = await extractTextFromFile(
            req.file.path,
            req.file.mimetype
        );

        //3. AI generationg Report
        const file = req.file;
        const filePath = file.path;

        const extractedText = await extractTextFromFile(filePath, file.mimetype);

        const cleanedText = extractedText
            .replace(/\s+/g, " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2");
        
        //3.1 Detect role using AI
        const {role, confidence } = await detectRoleFromResume(cleanedText);

        //3.2 Calculate ATS score
        const atsScore = calculateATSScore(cleanedText, role);

        //3.3  Generate AI report
        const aiReport = await generateAIReport(cleanedText);

        //4. Save to DB
        const report = await ResumeReport.create({
            userId: req.user.userId,
            resumeUrl: upload.secure_url,
            originalName: req.file.originalname,
            parsedText: cleanedText,
            aiReport: JSON.parse(aiReport),
            atsScore: {
                ...atsScore,
                confidence,
            },
        });

        res.json({
            ok: true,
            message: "Resume uploaded successfully",
            report,
        });
    } catch (error) {
        console.log("Cloudinary or DB Error >>>", error);
        return res.status(500).json({ message: error.message });
    }
}