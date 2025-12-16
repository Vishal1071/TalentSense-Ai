export const RESUME_ANALYSIS_PROMPT = (resumeText) => `
You are a senior technical recruiter and hiring manager.

Analyze the following resume text realistically.

CRITICAL RULES:
- Output MUST be valid JSON
- Use double quotes for ALL keys and ALL string values
- Do NOT use single quotes
- Do NOT add explanations or text outside JSON
- Fresher resumes MUST include weaknesses
- Be strict and realistic, not flattering

Resume Text:
${resumeText}

Return ONLY this JSON structure:

{
  "summary": "2–3 factual lines",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "skillGaps": ["..."],
  "experienceLevel": "fresher",
  "realismCheck": "What would block this candidate in real interviews",
  "recommendations": ["Specific technical improvements only"]
}
`;


export const JD_MATCH_PROMPT = (resumeText, jdText) => `
You are a technical recruiter.

Compare the resume with the job description.

Rules:
- Be realistic
- Fresher resumes cannot score above 75
- Penalize missing testing, CI/CD, deployment
- Return ONLY valid JSON
- Use double quotes only

Resume:
${resumeText}

Job Description:
${jdText}

Return JSON:
{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "recommendations": []
}
`;
