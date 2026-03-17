import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
    {
        userId:{
            type:  mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        resumeUrl: {
            type: String,
            required: true,
        },

        originalName: {
            type: String,
            required: true,
        },

        parsedText: {
            type: String,
            default: "",
        },

        aiReport: {
            type: Object,
            default: null,
        },

        atsScore: {
            type: Object,
            default: null,
        },
    },{ timestamps: true }
);

export default mongoose.model("ResumeReport", ResumeSchema);

