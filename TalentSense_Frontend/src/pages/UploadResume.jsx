import React from 'react'
import { useState } from 'react'
import api from '../api/axios.js'
import Circuler from "../components/commn/CircularProgress.jsx"


const UploadResume = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = async (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        setFile(selected);

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(selected.type)) {
            setError("Only PDF or DOCX files are allowed");
            setFile(null);
            return;
        }
        await handleUpload(selected);
        setError("");
    };

    const handleUpload = async (file) => {
        try {
            setLoading(true);
            setError("");
            const formData = new FormData();
            formData.append("resume", file);
            setResult(null);

            const res = await api.post("/api/resume/upload", formData);
            console.log(res.data.report);
            setResult(res.data.report);
        } catch (error) {
            setError(error.response?.data?.message || "Resume upload failed")
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="container-lg mt-6 px-4 flex flex-col items-center">
                <h1>Upload Resume</h1>
                <p className="text-muted mb-6">
                    Upload your resume to analyze skills and get improvement suggestions.
                </p>


                <div className="glass-card max-w-xl w-full min-h-[290px]">
                    {error && <div className="error-message">{error}</div>}

                    {loading ? (
                        <span className="flex-center gap-2 justify-items-center">
                            <span className="spinner"></span>
                            Analyzing...
                        </span>
                    ) : (
                        <div className="form-group">
                            <label className="form-label">Resume File (PDF or DOCX)</label>

                            <label
                                htmlFor="resume-upload"
                                className="flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 hover:opacity-80 hover:scale-[1.01] text-center"
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">Drop your resume here</p>
                                    <p className="text-xs mt-1 opacity-60">
                                        or <span className="font-bold underline underline-offset-2">click to browse</span> — PDF & DOCX supported
                                    </p>
                                </div>

                                <input
                                    id="resume-upload"
                                    type="file"
                                    accept=".pdf,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>

                        </div>

                    )}
                </div>


                {result && (
                    <div className="glass-card max-w-2xl mt-8 slide-up ">
                        <h2 className='mb-8 flex flex-col items-center'>Analysis Result</h2>

                        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">

                            <div className="flex flex-col items-center">
                                <span>
                                    <Circuler percentage={result.atsScore.score} />
                                </span>
                                <strong>ATS Score</strong>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label><strong>Role:</strong> {result.atsScore.role}</label>
                                <label><strong>Level:</strong> {result.atsScore.level}</label>
                                <label><strong>Experience Level:</strong> {result.aiReport.experienceLevel}</label>
                            </div>

                        </div>


                        <div>
                            <h4>Summary</h4>
                            <ul><li>{result.aiReport.summary}</li></ul>
                        </div>

                        {result.aiReport.strengths?.length > 0 && (
                            <div className="mt-4">
                                <h4>Strengths</h4>
                                <ul className="list-disc li">
                                    {result.aiReport.strengths.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {result.aiReport.weaknesses?.length > 0 && (
                            <div className="mt-4">
                                <h4>Weaknesses</h4>
                                <ul className="list-disc li">
                                    {result.aiReport.weaknesses.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {result.aiReport.skillGaps?.length > 0 && (
                            <div className="mt-4">
                                <h4>Skill gaps</h4>
                                <ul className="list-disc li">
                                    {result.aiReport.skillGaps.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.aiReport.recommendations?.length > 0 && (
                            <div className="mt-4">
                                <h4>Recommendations</h4>
                                <ul className="list-disc li">
                                    {result.aiReport.recommendations.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        )} <br />

                        <div>
                            <h4>Reality check</h4>
                            <ul><li>{result.aiReport.realismCheck}</li></ul>
                        </div>

                    </div>
                )}
            </div>
        </>
    )
}

export default UploadResume
