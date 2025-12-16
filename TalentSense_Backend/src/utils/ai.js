import Groq from "groq-sdk";
import { safeJsonParse } from "./jsonSafeParse.js";
import {RESUME_ANALYSIS_PROMPT} from "./promptTemplates.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});


export const generateAIReport = async (resumeText) => {
    const prompt = RESUME_ANALYSIS_PROMPT(resumeText);

    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role:"user", content: prompt }],
        temperature: 0.2,
    });
    
    const raw = response.choices[0].message.content;
    const aiReport = safeJsonParse(raw);

    console.log("RAW AI RESPONSE:", aiReport);

    return aiReport;
};

