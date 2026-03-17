import mongoose from "mongoose";

const jobReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  jobText: String,
  matchScore: Number,
  matchedSkills: [String],
  missingSkills: [String],
  recommendations: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("JobReport", jobReportSchema);
