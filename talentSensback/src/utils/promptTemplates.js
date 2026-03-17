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



export const interviewQuestionPrompt = ({ resumeText, jobText }) => `
You are a senior technical interviewer.

Candidate Resume:
${resumeText}

Job Description:
${jobText}

Ask ONE clear interview question relevant to the role.
Do NOT give feedback.
Return plain text only.
`;

export const evaluateAnswerPrompt = ({
  question,
  answer,
  resumeText,
  jobText,
}) => `
You are a strict technical interviewer.

Resume:
${resumeText}

Job Description:
${jobText}

Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer and return STRICT JSON ONLY in this format:
{
  "rating": number (0-10),
  "feedback": "short constructive feedback",
  "nextQuestion": "next interview question"
}
`;

export const interviewSummaryPrompt = ({ messages }) => `
You are an experienced technical interviewer evaluating a mock interview.

Analyze the following interview conversation between the interviewer (AI) and candidate.

Provide a realistic assessment based on the candidate's answers, feedback given, and overall performance.

- Calculate overallScore as an average of individual question ratings (each 0-10, so scale to 0-100 by multiplying by 10).
- Identify 2-4 key strengths from strong answers and positive feedback.
- Identify 2-4 key weaknesses from poor answers, low ratings, or patterns of issues.
- Provide 3-5 specific, actionable improvement suggestions based on the weaknesses.

Be strict but fair. Base the evaluation on the content of the conversation.

Return ONLY valid JSON with this exact structure (use double quotes for all strings):

{
  "overallScore": number (0-100),
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvementPlan": ["suggestion1", "suggestion2"]
}

Conversation:
${messages}
`;
