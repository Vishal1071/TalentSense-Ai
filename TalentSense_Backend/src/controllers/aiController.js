import Groq from "groq-sdk";
import JobReport from "../models/JobReport.js"
import { JD_MATCH_PROMPT } from "../utils/promptTemplates.js"
import { safeJsonParse } from "../utils/jsonSafeParse.js";
import { extractTextFromFile } from "../utils/parser.js"
import { cleanResumeText } from "../utils/textCleaner.js"


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

export const matchJobDescription = async (req, res, next) => {
    try {

        const { position, experience, skills, responsibilities, location } = req.body;

        if (!position || !experience || !skills || !responsibilities) {
            return res.status(400).json({
                ok: false,
                message: "All job fields are required"
            });
        }


        if (!req.file) {
            return res.status(400).json({
                ok: false,
                message: "Resume file is required"
            });
        }

        const parsedText = await extractTextFromFile(
            req.file.path,
            req.file.mimetype
        );

        const resumeText = await cleanResumeText(parsedText);

        const jobDescription = `
        Position: ${position}
        Experience Required: ${experience}
        Location: ${location}
        Required Skills:
        ${skills}
        Key Responsibilities:
        ${responsibilities}
        `;

        const prompt = JD_MATCH_PROMPT(resumeText, jobDescription);

        const compilation = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2
        });

        const aiText = compilation.choices[0].message.content;
        const result = safeJsonParse(aiText);

        if (
            typeof result.matchScore !== "number" ||
            !Array.isArray(result.matchedSkills) ||
            !Array.isArray(result.missingSkills) ||
            !Array.isArray(result.recommendations)
        ) {
            throw new Error("Invalid JD match structure");
        }

        if (result.matchScore > 75) {
            result.matchScore = 75;
        }

        const report = await JobReport.create({
            userId: req.user.id,
            jobText: jobDescription,
            matchScore: result.matchScore,
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,
            recommendations: result.recommendations
        });

        return res.status(200).json({
            ok: true,
            report
        });

    } catch (error) {
        next(error);
    }
}