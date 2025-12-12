import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});


export const generateAIReport = async (resumeText) => {
    const prompt = `
    You MUST respond with ONLY valid JSON. 
    No explanations. No extra words. No markdown. No "here is" or any intro.

    Return EXACTLY this structure:
    {
    "summary": "",
    "strengths": [],
    "weaknesses": [],
    "skills_detected": [],
    "job_fit": {
        "software_engineering": 0,
        "frontend_developer": 0,
        "backend_developer": 0,
        "mern_stack": 0,
        "ai_developer": 0
    },
    "recommendations": []
    }
    Resume Text:
  ${resumeText}
    `;

    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role:"user", content: prompt }],
        temperature: 0.2,
    });
    return response.choices[0].message.content;
};

