// import { useAuth } from "../context/AuthContext.jsx";
import Circuler from "../components/commn/CircularProgress.jsx"
import api from "../api/axios.js"
import { useEffect, useState } from "react";

const Dashboard = () => {

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const DashboardData = async () => {
    try {

      setLoading(true);
      const res = await api.get("/api/getdata/dashboard");
      setData(res.data);

    } catch (error) {
      setError(error || "somthing want wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    DashboardData();
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8">
      {loading && (
        <span className="flex-center gap-2">
          <span className="spinner"></span>
          Loding...
        </span>
      )}

      {error && (
        <div className="flex-center min-h-screen">
          <div className="error-message">{error}</div>
        </div>
      )}

      {data && (
        <div className="container-lg space-y-10">
          <div>
            <h1 className="mb-8">Dashboard Overview</h1>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="glass-card">
              <h3 className="mb-2">Resumes Analyzed</h3>
              <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{data.state.resumesAnalyzed}</p>
            </div>
            <div className="glass-card">
              <h3 className="mb-2">Job Matches</h3>
              <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{data.state.jobMatches}</p>
            </div>
            <div className="glass-card">
              <h3 className="mb-2">Mock Interviews</h3>
              <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{data.state.mockInterviews}</p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
            <div className="glass-card">
              <h2 className="mb-6">ATS Score</h2>
              <div className="flex-center flex-col gap-4">
                <Circuler percentage={data?.latestResume?.atsScore?.score || 0} />
                <div className="text-center">
                  <p className="mb-2">Level: {data?.latestResume?.atsScore?.level || "N/A"}</p>
                  <p>Confidence: {data?.latestResume?.atsScore?.confidence || 0}%</p>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h2 className="mb-4">Resume Summary</h2>
              <p className="mb-4">{data?.latestResume?.aiReport?.summary || "NO resume uploaded yet"}</p>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Experience Level: {data?.latestResume?.aiReport?.experienceLevel || "NO data available"}</p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass-card">
              <h2 className="mb-4">Strengths</h2>
              <ul className="list">
                {data?.latestResume?.aiReport?.strengths?.length > 0 ? (
                  data.latestResume.aiReport.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3 lol">
                      <span className="text-xl">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))) : (
                  <p>No strengths available</p>
                )}
              </ul>
            </div>

            <div className="glass-card">
              <h2 className="mb-4">Weaknesses</h2>
              <ul className="list">
                {data?.latestResume?.aiReport?.weaknesses?.length > 0 ? (
                  data.latestResume.aiReport.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-3 lol">
                      <span className="text-xl">✗</span>
                      <span>{weakness}</span>
                    </li>
                  ))) : (
                  <p>NO weaknesses available</p>
                )}
              </ul>
            </div>

            <div className="glass-card">
              <h2 className="mb-4">Skill Gaps</h2>
              <ul className="list">
                {data?.latestResume?.aiReport?.skillGaps?.length > 0 ? (
                  data.latestResume.aiReport.skillGaps.map((gap, index) => (
                    <li key={index} className="flex items-start gap-3 lol">
                      <span className="text-xl">⚠</span>
                      <span>{gap}</span>
                    </li>
                  ))) : (
                  <p>NO skill gap available</p>
                )}
              </ul>
            </div>

            <div className="glass-card">
              <h2 className="mb-4">Recommendations</h2>
              <ul className="list">
                {data?.latestResume?.aiReport?.recommendations?.length > 0 ? (
                  data.latestResume.aiReport.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 lol">
                      <span className="text-xl">→</span>
                      <span>{rec}</span>
                    </li>
                  ))) : (
                  <p>NO recommendations available</p>
                )}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-1 mt-4">Recent Job Matches</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data?.recentMatches?.length > 0 ? (
                data.recentMatches.map((match, index) => (
                  <div key={match._id || index} className="glass-card">
                    <div className="flex-center flex-col gap-4 mb-4">
                      <Circuler percentage={match?.matchScore || 0} />
                      <h3>Match Score</h3>
                    </div>

                    <div>
                      <p className="font-semibold mb-3">Matched Skills:</p>

                      {match?.matchedSkills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {match.matchedSkills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-5 py-2"
                              style={{
                                borderRadius: '9999px',
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                padding: '5px',
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm opacity-70">No matched skills</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card text-center col-span-3">
                  <h3>No Job Matches Yet</h3>
                  <p>Upload a resume to get job matches</p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
