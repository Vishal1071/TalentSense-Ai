import React from 'react'
import { useState } from 'react'
import api from '../api/axios.js'


const UploadResume = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(selected.type)) {
            setError("Only PDF or DOCX files are allowed");
            setFile(null);
            return;
        }
        setError("");
        setFile(selected);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("please select a resume file");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const res = await api.post("/api/resume/upload", formData);
            console.log(res);
            setResult(res.data);
        } catch (error) {
            setError(error.response?.data?.message || "Resume upload failed")
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="container-lg mt-6">
                <h1>Upload Resume</h1>
                <p className="text-muted mb-6">
                    Upload your resume to analyze skills and get improvement suggestions.
                </p>

                <div className="glass-card max-w-xl">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Resume File (PDF or DOCX)</label>
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? (
                            <span className="flex-center gap-2">
                                <span className="spinner"></span>
                                Analyzing...
                            </span>
                        ) : (
                            "Upload & Analyze"
                        )}
                    </button>
                </div>

                {result && (
                    <div className="glass-card max-w-xl mt-8 slide-up">
                        <h2>Analysis Result</h2>

                        <p>
                            <strong>Score:</strong>{" "}
                            <span className="text-accent">{result.score}%</span>
                        </p>

                        {result.missingSkills?.length > 0 && (
                            <div className="mt-4">
                                <h4>Missing Skills</h4>
                                <ul className="list">
                                    {result.missingSkills.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.suggestions?.length > 0 && (
                            <div className="mt-4">
                                <h4>Suggestions</h4>
                                <ul className="list">
                                    {result.suggestions.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default UploadResume
