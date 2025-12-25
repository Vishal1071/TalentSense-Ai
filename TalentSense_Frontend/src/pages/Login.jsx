import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import '../components/commn/loader.css'
import '../main.css'

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className="min-h-screen flex-center">
            <div className="container slide-up">
                <div className="glass-card">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="icon-container" style={{ margin: '0 auto 1.25rem' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                        </div>
                        <h2>Login</h2>
                        <p className="text-muted">Welcome back! Please login to continue</p>
                    </div>

                    {/* Error Message */}
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

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="w-full">
                            {loading ? (
                                <div className="spinner"></div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center mt-6 text-muted">
                        Don't have an account?{' '}
                        <a href="/register" className="text-accent">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login;
