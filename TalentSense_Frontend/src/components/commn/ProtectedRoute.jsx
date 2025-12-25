import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import './loader.css'

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center">
            <div className="spinner"></div>
        </div>
    );
    if (!user) return <Navigate to="/login" replace />

    return children;
};

export default ProtectedRoute;