import InterviewChat from "../models/InterviewChat.js"
import ResumeReport from "../models/ResumeReport.js"
import JobReport from "../models/JobReport.js"
import mongoose from "mongoose"
import {
  interviewQuestionPrompt,
  evaluateAnswerPrompt,
  interviewSummaryPrompt,
} from "../utils/promptTemplates.js"
import Groq from "groq-sdk"
import { cleanResumeText } from "../utils/textCleaner.js"
import { safeJsonParse } from "../utils/jsonSafeParse.js"



const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const groqReport = async (prompt) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });
  return completion.choices[0].message.content;
}


export const startInterview = async (req, res, next) => {
  try {
    const { resumeId, jobReportId } = req.body;

    // 🔐 Auth safety
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // 🧱 Input validation
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resumeId" });
    }

    if (!mongoose.Types.ObjectId.isValid(jobReportId)) {
      return res.status(400).json({ message: "Invalid jobReportId" });
    }

    // 📦 Fetch data
    const resume = await ResumeReport.findById(resumeId);
    const job = await JobReport.findById(jobReportId);

    if (!resume || !job) {
      return res.status(404).json({ message: "Resume or Job not found" });
    }

    // 🤖 Generate question
    const question = await groqReport(
      interviewQuestionPrompt({
        resumeText: resume.parsedText,
        jobText: job.jobText,
      })
    );

    // 🧠 Create interview session
    const interview = await InterviewChat.create({
      userId: req.user.id,
      resumeId,
      JobReportId: jobReportId,
      message: [{ role: "ai", text: question }],
    });

    res.status(201).json({
      interviewId: interview._id,
      question,
    });
  } catch (err) {
    next(err);
  }
};



export const answerQuestion = async (req, res, next) => {
  try {
    const { interviewId, answer } = req.body;

    const interview = await InterviewChat.findById(interviewId);
    if (!interview || interview.status !== "active") {
      return res.status(400).json({ message: "invalide interview session" })
    }

    if (!answer || answer.trim().length < 10) {
      return res.status(400).json({
        message: "Answer is required and must be meaningful."
      });
    }

    const lastQuestion = [...interview.message]
      .reverse()
      .find((m) => m.role === "ai");

    const resume = await ResumeReport.findById(interview.resumeId);
    const job = await JobReport.findById(interview.JobReportId);

    const aiText = await groqReport(
      evaluateAnswerPrompt({
        question: lastQuestion.text,
        answer,
        resumeText: resume.parsedText,
        jobText: job.jobText,
      })
    );

    const parsed = safeJsonParse(aiText);

    interview.message.push({ role: "user", text: answer });
    interview.message.push({
      role: "ai",
      text: `Feedback: ${parsed.feedback}\n\nNext Question: ${parsed.nextQuestion}`,
      rating: parsed.rating,
    });

    await interview.save();

    res.json({
      rating: parsed.rating,
      feedback: parsed.feedback,
      nextQuestion: parsed.nextQuestion,
    })

  } catch (error) {
    next(error);
  }
}


export const endInterview = async (req, res, next) => {
  try {
    const { interviewId } = req.body;

    const interview = await InterviewChat.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "interview not found" });
    }

    const conversation = interview.message
      .filter(m => m.text && m.text.trim().length > 0)
      .map(m => {
        if (m.role === "ai") {
          const ratingText = m.rating !== null ? ` (Rating: ${m.rating}/10)` : '';
          return `INTERVIEWER: ${m.text}${ratingText}`;
        }
        if (m.role === "user") return `CANDIDATE: ${m.text}`;
      })
      .join("\n");

    const userAnswers = interview.message.filter(m => m.role === "user");

    if (userAnswers.length < 3) {
      return res.status(400).json({
        message: "At least 3 answered questions are required for evaluation."
      });
    }

    const aiText = await groqReport(
      interviewSummaryPrompt({ messages: conversation })
    );

    const summary = safeJsonParse(aiText);

    interview.status = "completed";
    interview.aiSummary = summary;
    await interview.save();

    res.json(summary);

  } catch (error) {
    next(error);
  }
}