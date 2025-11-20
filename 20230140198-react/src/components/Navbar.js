import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {jwt_decode} from "jwt-decode";

const Navbar = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    let user = null;

    if (token) {
        try {
        user = jwt_decode(token);
        } catch (err) {
        console.log("Token tidak valid");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav style={{ padding: "15px", background: "#eee", marginBottom: "20px" }}>
        <Link to="/dashboard" style={{ marginRight: "15px" }}>Dashboard</Link>
        <Link to="/presensi" style={{ marginRight: "15px" }}>Presensi</Link>

        {user && user.role === "admin" && (
            <Link to="/reports" style={{ marginRight: "15px" }}>Laporan Admin</Link>
        )}

        <span style={{ marginRight: "20px" }}>
            {user ? `Hai, ${user.nama}` : ""}
        </span>

        <button onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default Navbar;
