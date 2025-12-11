import cloudinary from "../config/cloudinary.js";
import ResumeReport from "../models/ResumeReport.js";

export const uploadResume = async ( req, res, next) => {
    try {

        if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

        //upload file to Cloudinary
        const upload = await cloudinary.uploader.upload(req.file.path, {
            folder: "TalentSense/resumes",
            resource_type: "raw",
        });

        // Save to DB
        const report = await ResumeReport.create({
            userId: req.user.userId,
            resumeUrl: upload.secure_url,
            originalName: req.file.originalname,
        });

        res.json({
            ok: true,
            message: "Resume uploaded successfully",
            report,
        });
    } catch (error) {
        console.log("Cloudinary or DB Error >>>", error);
        return res.status(500).json({ message: error.message });
    }
}