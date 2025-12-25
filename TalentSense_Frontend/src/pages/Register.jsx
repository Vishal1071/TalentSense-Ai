import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import '../components/commn/loader.css'
import '../main.css'


const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await register(name, email, password);
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || "Register failed");
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
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h2>Register</h2>
                            <p className="text-muted">Create your account to get started</p>
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
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

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
                                    "Register"
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="text-center mt-6 text-muted">
                            Already have an account?{' '}
                            <a href="/login" className="text-accent">Sign in</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;
