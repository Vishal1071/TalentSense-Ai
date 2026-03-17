import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    role:{
        type: String,
        enum: ["ai", "user"],
        required: true,
    },
    text:{
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
        default: null,
    },
},{ _id: false }    
);


export const interviewChatSchema = mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ResumeReport",
        required: true,
    },
    JobReportId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobReport",
        required: true,
    },
    message: {
        type: [messageSchema],
        default: [],
    },
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
    },
    aiSummary: {
        type: mongoose.Schema.Types.Mixed,   
        default: null,
    },
},
{ timestamps: true }
);

export default mongoose.model("InterviewChat", interviewChatSchema);