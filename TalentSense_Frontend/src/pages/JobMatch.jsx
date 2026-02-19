import { useState } from 'react'
import api from '../api/axios.js'

const JobMatch = () => {

    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Ony PDF or DOCX files are allowed");
            setResumeFile(null);
            return;
        }

        setError("");
        setResumeFile(file);
    };

    const handleMatch = async () => {
        console.log("Resume:", resumeFile);
        console.log("Type:", typeof resumeFile);


        if (!resumeFile || !jobDescription.trim()) {
            setError("Resume and job Description are required");
            return;
        }

        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("jobDescription", jobDescription);

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const res = await api.post("/api/ai/match-jd", formData);
            console.log(res.data.report);
            setResult(res.data.report);
        } catch (error) {
            setError(error.response?.data?.message || "JD-match failed")
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="container-lg mt-6">
                <h1>JD Match Analyzer</h1>
                <p className="text-muted mb-6">
                    Compare your resume against a job description and get match insights.
                </p>

                <div className="glass-card max-w-2xl">

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Upload Resume (PDF)</label>
                        <input name="resume" type="file" accept=".pdf,.docx" onChange={handleFileChange} />
                    </div>

                    <div className="form-group mt-6">
                        <label className="form-label">Paste Job Description</label>
                        <textarea
                            rows="6"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste full job description here..."
                        />
                    </div>

                    <button
                        onClick={handleMatch}
                        disabled={loading}
                        className="w-full mt-6"
                    >
                        {loading ? (
                            <span className="flex-center gap-2">
                                <span className="spinner"></span>
                                Matching...
                            </span>
                        ) : (
                            "Analyze Match"
                        )}
                    </button>
                </div>

                {result && (
                    <div className="glass-card max-w-2xl mt-8 slide-up">

                        <h2>Match Result</h2>

                        <p>
                            <strong>Match Score:</strong>{" "}
                            <span className="text-accent">{result.matchScore}%</span>
                        </p>

                        {result.matchedSkills?.length > 0 && (
                            <div className="mt-4">
                                <h4>Matched Skills</h4>
                                <ul className="list">
                                    {result.matchedSkills.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

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

                        {result.recommendations?.length > 0 && (
                            <div className="mt-4">
                                <h4>Suggestions</h4>
                                <ul className="list">
                                    {result.recommendations.map((s, i) => (
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

export default JobMatch
