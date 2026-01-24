import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const Sidebar = () => {
    const { logout } = useAuth();

    return (
        <div className="side w-74 h-screen glass-card flex flex-col">
            <div className="p-6 border-b" style={{ borderColor: 'var(--glass-border)' }}>
                <h3>TalentSense AI</h3>
            </div>

            <nav className="list flex-1 p-4">
                {[
                    { to: "/", label: "Dashboard" },
                    { to: "/upload-resume", label: "Upload Resume" },
                    { to: "/mock-interview", label: "Mock Interview" }
                ].map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `lol flex items-center px-4 py-3 rounded-lg transition-all font-medium
     ${isActive
                                ? "bg-[var(--accent-primary)] text-white shadow-md"
                                : "text-muted hover:bg-[var(--glass-bg)] hover:text-white"
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <button onClick={logout} className="m-4 text-red-400 hover:text-red-500">
                Logout
            </button>
        </div>
    )
}

export default Sidebar
