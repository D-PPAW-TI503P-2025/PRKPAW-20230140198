import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/AppTheme.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama:"", role:"mahasiswa", email:"", password:"" });
  const [loading,setLoading] = useState(false);

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registrasi berhasil");
        navigate("/login");
      } else {
        alert(data.message || "Registrasi gagal");
      }
    } catch (err) {
      alert("Server error");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Buat akun baru</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input name="nama" className="input" placeholder="Nama lengkap" value={form.nama} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <select name="role" className="input select" value={form.role} onChange={handleChange}>
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <input name="email" className="input" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <input name="password" className="input" placeholder="Password" type="password" value={form.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Mendaftarkan..." : "Daftar"}</button>
          </div>

          <div style={{textAlign:"center", color:"var(--muted)"}}>
            Sudah punya akun? <a href="/login" style={{ color: "#1877F2", fontWeight: 500 }}>Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
