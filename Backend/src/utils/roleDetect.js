import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const detectRoleFromResume = async (resumeText) => {
    const prompt = `
    You are a resume classifier.

    From the resume text, detect the PRIMARY job role.
    Choose ONLY ONE from this list:

    frontend
    backend
    fullstack
    mobile
    qa
    devops
    data
    ai_ml

    Return ONLY valid JSON.

    Format:
    {
    "role": "one_of_the_roles_above",
    "confidence": 0.0-1.0
    }

    Resume Text:
    ${resumeText}
    `;

    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role : "user", content : prompt }],
        temperature: 0,
    });

    const raw = response.choices[0].message.content.trim();
    const cleaned = raw.replace(/^[^{]+/, "").replace(/[^}]+$/, "");

    return JSON.parse(cleaned);
};