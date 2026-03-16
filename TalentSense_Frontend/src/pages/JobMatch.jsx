import { useState } from 'react'
import api from '../api/axios.js'
import Circuler from "../components/commn/CircularProgress.jsx"


const JobMatch = () => {

    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [jobDescription, setJobDescription] = useState({
        position: "",
        experience: "", 
        skills: "", 
        responsibilities: "", 
        location: "",
    });

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

    const handlechanges = (e) =>{
        const {name, value} = e.target
        setJobDescription({
            ...jobDescription, 
            [name]: value
        })
    }

    const handleMatch = async () => {
        console.log("Resume:", resumeFile);
        console.log("Type:", typeof resumeFile);
        console.log("job Description", jobDescription);


        if (!resumeFile || !jobDescription.position || !jobDescription.experience || !jobDescription.skills || !jobDescription.responsibilities || !jobDescription.location) {
            setError("Resume and job Description are required");
            return;
        }

        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("position", jobDescription.position);
        formData.append("experience", jobDescription.experience);
        formData.append("skills", jobDescription.skills);
        formData.append("responsibilities", jobDescription.responsibilities);
        formData.append("location", jobDescription.location);

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
            <div className="container-lg mt-6 px-4">
                <h1>JD Match Analyzer</h1>
                <p className="text-muted mb-6">
                    Compare your resume against a job description and get match insights.
                </p>

                   <div className="glass-card max-w-xl w-full min-h-[290px]">

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Upload Resume (PDF)</label>
                        <label
                                htmlFor="resume-upload"
                                className="flex  items-center justify-center gap-4 p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 hover:opacity-70 hover:scale-[1.01] text-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 " viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                        <input name="resume" type="file" accept=".pdf,.docx" onChange={handleFileChange}/>
                        </label>
                    </div>

                    <div className="form-group mt-4">
                        <label className='form-label'>Position</label>
                        <input 
                         type="text"
                         name="position"
                         onChange={handlechanges}
                         placeholder='e.g. MERN stack Developer'
                         />

                         <label className='form-label'>Experience</label>
                        <input 
                         type="text"
                         name="experience"
                         onChange={handlechanges}
                         placeholder='e.g. 2+ years'
                         />

                         <label className='form-label'>Skills</label>
                        <input 
                         type="text"
                         name="skills"
                         onChange={handlechanges}
                         placeholder='React, Node.js, MongoDB'
                         />

                         <label className='form-label'>Responsibilities</label>
                        <input 
                         type="text"
                         name="responsibilities"
                         onChange={handlechanges}
                         placeholder='Describe job Responsibilities'
                         />

                         <label className='form-label'>Location</label>
                        <input 
                         type="text"
                         name="location"
                         onChange={handlechanges}
                         placeholder='Ahemdabad / Remote'
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
                    <div className="glass-card max-w-xl w-full min-h-[290px] mt-5">

                        <h2>Match Result</h2>

                        <div className='flex flex-col items-center'>
                            <Circuler percentage={result.matchScore} />
                            <strong>Match Score</strong>
                        </div>

                        {result.matchedSkills?.length > 0 && (
                            <div className="mt-4">
                                <h4>Matched Skills</h4>
                                <ul className="list-disc li">
                                    {result.matchedSkills.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.missingSkills?.length > 0 && (
                            <div className="mt-4">
                                <h4>Missing Skills</h4>
                                <ul className="list-disc li">
                                    {result.missingSkills.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.recommendations?.length > 0 && (
                            <div className="mt-4">
                                <h4>Suggestions</h4>
                                <ul className="list-disc li">
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
