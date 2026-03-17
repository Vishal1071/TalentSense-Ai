import { ROLE_KEYWORDS } from "../config/roles.js";

export const calculateATSScore = (resumeText, role) => {
    const keywords = ROLE_KEYWORDS[role];

    if(!keywords){
        return{
            role,
            score: 0,
            level: "Unknown",
            matchedKeywords: [],
            missingKeywords: [],
        };
    }

    const text = resumeText.toLowerCase();

    let matched = [];
    let missing = [];

    keywords.forEach((keyword) => {
        if(text.includes(keyword)) matched.push(keyword);
        else missing.push(keyword);
    });

    const score = Math.round((matched.length / keywords.length) * 100);

    let level = "weak";
    if(score >= 80) level = "Strong";
    else if(score >= 60) level = "Average";

    return {
        role,
        score,
        level,
        matchedKeywords: matched,
        missingKeywords: missing,
    };
};