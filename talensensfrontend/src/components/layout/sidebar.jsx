import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState } from "react";
import "./layout.css";

const Sidebar = () => {
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);

    const links = [
        { to: "/", label: "Dashboard" },
        { to: "/upload-resume", label: "Upload Resume" },
        { to: "/jobMatch", label: "JobMatch" },
        { to: "/mock-interview", label: "Mock Interview" },
    ];

    return (
        <>
            {/* MOBILE TOP BAR */}
            <div className="mobile-header">
                <h3 className="logo">TalentSense AI</h3>

                <button
                    className="burger"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>
            </div>

            {/* OVERLAY */}
            {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

            {/* SIDEBAR */}
            <div className={`sidebar ${open ? "open" : ""}`}>
                <div className="sidebar-header">
                    <h3>TalentSense AI</h3>
                </div>

                <nav className="nav">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                            onClick={() => setOpen(false)}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <button onClick={logout} className="logout">
                    Logout
                </button>
            </div>
        </>
    );
};

export default Sidebar;