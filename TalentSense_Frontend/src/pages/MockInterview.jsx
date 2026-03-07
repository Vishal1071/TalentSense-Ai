import api from '../api/axios.js'
import { useRef, useState, useEffect } from 'react'

const MockInterview = () => {

  const bottomRef = useRef(null)

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [aisummary, setAisummary] = useState([]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startInterview = async () => {
    try {
      setTyping(true);
      const res = await api.post('/api/ai/mock-interview/start');

      setSessionId(res.data._id);
      setStarted(true);

      setMessages([
        {
          role: "ai",
          question: res.data.question,
          rating: null,
          feedback: null
        }
      ]);
    } catch (error) {
      setError(error.response?.data?.message || "somthing want wrong")
    } finally {
      setTyping(false);
    }
  };

  const sendAnswer = async () => {
    try {
      setError("")
      if (!input.trim()) return;

      const userMessage = input;

      setMessages(prev => [
        ...prev,
        { role: "user", text: userMessage }
      ]);

      setInput("");
      setTyping(true);

      const res = await api.post("/api/ai/mock-interview/answer", {
        sessionId,
        answer: userMessage
      });

      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          question: res.data.nextQuestion,
          rating: res.data.rating,
          feedback: res.data.feedback
        }
      ]);
    } catch (error) {
      setError(error.response?.data?.message || "somthing want wrong")
    } finally {
      setTyping(false);
    }
  };

  const endInterview = async () => {
    try {
      setTyping(true);

      const res = await api.post("/api/ai/mock-interview/end", {
        sessionId
      });

      setAisummary(prev => [
        ...prev,
        {
          overallScore: res.data.overallScore,
          strengths: res.data.strengths,
          weaknesses: res.data.weaknesses,
          improvementPlan: res.data.improvementPlan
        }
      ]);
      setEnded(true);
    } catch (error) {
      setError(error.response?.data?.message || "somthing want wrong")
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <div className='chat-container'>

        {messages.map((msg, i) => (

          msg.role === "user" ? (

            <div key={i} className="user-msg">
              {msg.text}
            </div>

          ) : (

            <div key={i} className="ai-msg space-y-2">

              {msg.rating !== null && (
                <div className="text-sm">
                  ⭐ <strong>Rating:</strong> {msg.rating}/10
                </div>
              )}<br></br>

              {msg.feedback && (
                <div className="text-sm">
                  💡 <strong>Feedback:</strong> {msg.feedback}
                </div>
              )}<br></br>

              <div className="font-sm">
                ❓ <strong>Next Question:</strong> {msg.question}
              </div>

            </div>
          )
        ))}

        {aisummary.map((summary, i) => (
          <div key={i} className="ai-msg space-y-2">

            {summary.overallScore !== null && (
              <div className="text-sm">
                ⭐ <strong>Overall Rating:</strong> {summary.overallScore}/100
              </div>
            )} <br />

            {summary.strengths && (
              <div className="text-sm">
                🫡 <strong>Strengths:</strong>
                <ul className="list-disc ml-6 li">
                  {summary.strengths.map((item, index) => (
                    <li key={index} >{item}.</li>
                  ))}
                </ul>
              </div>
            )} <br />

            {summary.weaknesses && (
              <div className="text-sm">
                🤬 <strong>Weaknesses:</strong>
                <ul className='list-disc ml-6 li'>
                  {summary.weaknesses.map((item, index) => (
                    <li key={index}>{item}.</li>
                  ))}
                </ul>
              </div>
            )}<br />

            {summary.improvementPlan && (
              <div className="text-sm">
                💡 <strong>ImprovementPlan:</strong>
                <ul className='list-disc ml-6 li'>
                  {summary.improvementPlan.map((item, index) => (
                    <li key={index}>{item}.</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        ))}

        {error && (
          <div className="error-message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}


        {typing && (
          <div className="ai-msg typing">
            <span><b>.</b></span>
            <span><b>.</b></span>
            <span><b>.</b></span>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="w-full flex justify-center mt-4">
        <div className="w-full max-w-3xl relative">

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            rows={1}
            className="w-full rounded-full outline-none resize-none overflow-hidden min-h-[10px]"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />

          <div className="absolute right-2 bottom-4 flex items-center gap-2">

            <button
              onClick={endInterview}
              className="flex items-center justify-center w-10 h-10 rounded-full"
            >⏸</button>

            {!started ? (
              <button
                onClick={startInterview}
                className="flex items-center justify-center w-10 h-10 rounded-full"
              >⏻</button>
            ) : (
              <button
                onClick={sendAnswer}
                className="flex items-center justify-center w-10 h-10 rounded-full"
              >➤</button>
            )}

          </div>

        </div>
      </div>
    </>
  )
}

export default MockInterview
