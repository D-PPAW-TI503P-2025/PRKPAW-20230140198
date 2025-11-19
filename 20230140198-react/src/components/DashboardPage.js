import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardStyle.css";

const DashboardPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="dash-container">
        <div className="dash-card">
            <h1 className="dash-title">Dashboard</h1>
            <p className="dash-sub">Selamat datang! 🎀</p>

            <button className="dash-btn" onClick={handleLogout}>
            Logout
            </button>
        </div>
        </div>
    );
};

export default DashboardPage;
