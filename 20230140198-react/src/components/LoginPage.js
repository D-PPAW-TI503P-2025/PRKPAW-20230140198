import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/AppTheme.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login gagal");
      }
    } catch (err) {
      alert("Server error");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" role="main" aria-labelledby="loginTitle">
        <h2 id="loginTitle" className="auth-title">Masuk ke MyKampus</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input className="input" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>

          <div className="form-group">
            <button className="btn-primary" type="submit" disabled={loading}>{loading ? "Masuk..." : "Masuk"}</button>
          </div>

          <div style={{textAlign:"center", color:"var(--muted)"}}>
            Belum punya akun? <a href="/register" style={{ color: "#1877F2", fontWeight: 500 }}>Daftar</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
