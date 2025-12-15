import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});


export const generateAIReport = async (resumeText) => {
    const prompt = `
    You are a STRICT resume analysis engine.

    You MUST return ONLY valid JSON.
    No explanations.
    No markdown.
    No intro text.
    No "Here is".
    Only JSON.

    Return EXACTLY this structure:
    {
    "summary": "2–3 sentence professional summary",
    "strengths": [
     "minimum 3 technical strengths"
    ],
    "weaknesses": [
     "minimum 2 realistic weaknesses or gaps"
    ],
    "skills_detected": [
     "list of detected technical skills"
    ],
    "job_fit": {
        "software_engineering": 0,
        "frontend_developer": 0,
        "backend_developer": 0,
        "mern_stack": 0,
        "ai_developer": 0
    },
    "recommendations": [
      "minimum 3 SPECIFIC, ACTIONABLE, TECHNICAL recommendations"
     ]
    }

    CRITICAL RULES:
    - job_fit values MUST be integers between 0 and 100 (not 0 or 1)
    - weaknesses array MUST NOT be empty
    - recommendations MUST be specific (e.g. “Add Redis caching”, not “Learn new tech”)
    - Do NOT invent experience not found in resume
    - Base all analysis ONLY on the provided resume text

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

