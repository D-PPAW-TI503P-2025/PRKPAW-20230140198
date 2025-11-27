import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // navbar tidak muncul di login & register
    if (
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/register"
    ) {
        return null;
    }

    const token = localStorage.getItem("token");
    let user = null;

    if (token) {
        try {
        user = jwtDecode(token);
        } catch (err) {
        console.log("Token tidak valid");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav
        style={{
            width: "100%",
            backgroundColor: "#ff2e86",      // PINK TUA
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
        }}
        >
        {/* KIRI: Hai, Nama */}
        <div style={{ fontWeight: "bold" }}>
            Hai, {user ? user.nama : ""}
        </div>

        {/* TENGAH: Menu */}
        <div style={{ display: "flex", gap: "25px" }}>
            <Link style={{ color: "white", textDecoration: "none" }} to="/dashboard">
            Dashboard
            </Link>

            <Link style={{ color: "white", textDecoration: "none" }} to="/presensi">
            Presensi
            </Link>

            {user && user.role === "admin" && (
            <Link
                style={{ color: "white", textDecoration: "none" }}
                to="/reports"
            >
                Laporan Admin
            </Link>
            )}
        </div>

        {/* KANAN: Logout */}
        <button
            onClick={handleLogout}
            style={{
            backgroundColor: "white",
            color: "#ff1975",
            border: "none",
            padding: "8px 15px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            }}
        >
            Logout
        </button>
        </nav>
    );
};

export default Navbar;
