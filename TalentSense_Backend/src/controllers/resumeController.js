import cloudinary from "../config/cloudinary.js";
import ResumeReport from "../models/ResumeReport.js";
import { extractTextFromFile } from "../utils/parser.js";
import { generateAIReport } from "../utils/ai.js";
import { detectRoleFromResume } from '../utils/roleDetect.js'
import { calculateATSScore } from '../utils/ats.js'
import { cleanResumeText } from "../utils/textCleaner.js";

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
        const cleanedText = await cleanResumeText(parsedText);

        //3.1 Detect role using AI
        const { role, confidence } = await detectRoleFromResume(cleanedText);

        //3.2 Calculate ATS score
        const atsScore = calculateATSScore(cleanedText, role);

        //3.3  Generate AI report
        const aiReport = await generateAIReport(cleanedText);

        function validateAIReport(report) {
            const requiredKeys = [
                "summary",
                "strengths",
                "weaknesses",
                "skillGaps",
                "experienceLevel",
                "realismCheck",
                "recommendations"
            ];

            for (const key of requiredKeys) {
                if (!report.hasOwnProperty(key)) {
                    throw new Error(`Missing key: ${key}`);
                }
            }

            if (!Array.isArray(report.strengths)) {
                throw new Error("Strengths must be an array");
            }

            if (!Array.isArray(report.weaknesses) || report.weaknesses.length === 0) {
                throw new Error("Weaknesses must be a non-empty array");
            }

            if (!["fresher", "junior", "mid"].includes(report.experienceLevel)) {
                throw new Error("Invalid experience level");
            }
        }


        validateAIReport(aiReport);


        //4. Save to DB
        const report = await ResumeReport.create({
            userId: req.user.id,
            resumeUrl: upload.secure_url,
            originalName: req.file.originalname,
            parsedText: cleanedText,
            aiReport,
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