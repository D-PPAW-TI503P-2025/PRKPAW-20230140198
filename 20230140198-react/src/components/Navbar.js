import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./../styles/AppTheme.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // hide on auth pages
  if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register") return null;

  const token = localStorage.getItem("token");
  let user = null;
  if (token) {
    try { user = jwtDecode(token); } catch(e){ user = null; }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-container">
      <header className="navbar" role="navigation">
        <div className="nav-left">
          <div className="brand">MyKampus</div>
          <div className="hi-name">Hai, {user ? user.nama : "Pengguna"}</div>
        </div>

        <div className="nav-center" role="menubar">
          <Link to="/dashboard" role="menuitem">Dashboard</Link>
          <Link to="/presensi" role="menuitem">Presensi</Link>
          {user && user.role === "admin" && <Link to="/reports" role="menuitem">Laporan Admin</Link>}
        </div>

        <div className="nav-right">
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
