import ResumeReport from "../models/ResumeReport.js";
import InterviewChat from "../models/InterviewChat.js";
import JobReport from "../models/JobReport.js";

export const getDashboardData = async(req, res, next) => {
    try {
        const userId = req.user.id;

        const resume = await ResumeReport.find({ userId }).sort({ createdAt: -1 });
        const interviews = await InterviewChat.find({ userId });
        const matches = await JobReport.find({ userId }).sort({ createdAt: -1 }).limit(3);

        const totalMatches = await JobReport.countDocuments({ userId });

        const avgScore = resume.length > 0
        ? resume.reduce((sum, r) => sum + (r.atsScore?.score || 0), 0) / resume.length
        : 0;



        res.json({
            state: {
                resumesAnalyzed: resume.length,
                avgAtsScore: avgScore,
                mockInterviews: interviews.length,
                jobMatches: totalMatches
            },
            latestResume: resume[0] || null,
            recentMatches: matches,
        });
 
    } catch (error) {
        next(error);
    }
};