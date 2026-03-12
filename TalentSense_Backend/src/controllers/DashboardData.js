import ResumeReport from "../models/ResumeReport.js";
import InterviewChat from "../models/InterviewChat.js";
import JobReport from "../models/JobReport.js";

export const getDashboardData = async(req, res, next) => {
    try {
        const userId = req.user.id;

        const resume = await ResumeReport.find({ userId });
        const interviews = await InterviewChat.find({ userId });
        const matches = await JobReport.find({ userId }).sort({ createdAt: -1 }).limit(3);

        const avgScore = resume.reduce((sum, r) => sum + r.aiReport.score, 0) / (resume.length || 1);

        res.json({
            state: {
                resumesAnalyzed: resume.length,
                avgAtsScore: avgScore,
                mockInterviews: interviews.length,
                jobMatches: matches.length
            },
            latestResume: resume.length ? resume[resume.length - 1] : null,
            recentMatches: matches
        });
 
    } catch (error) {
        next(error);
    }
};