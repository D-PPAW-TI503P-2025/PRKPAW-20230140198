import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthStyle.css";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nama: "",
        role: "mahasiswa",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
        const res = await fetch("http://localhost:3001/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form), 
        });

        const data = await res.json();

        if (!res.ok) {
            const msg = data.message || "Registrasi gagal!";
            alert(msg);
            setLoading(false);
            return;
        }

        alert(data.message || "Registrasi berhasil!");
        setLoading(false);
        navigate("/login");
        } catch (err) {
        console.error("Register error:", err);
        alert("Terjadi kesalahan jaringan/servеr.");
        setLoading(false);
        }
    };

    return (
        <div className="auth-container">
        <div className="auth-card">
            <h2 className="auth-title">Register Akun</h2>

            <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="nama"
                placeholder="Nama Lengkap"
                value={form.nama}
                onChange={handleChange}
                className="auth-input"
                required
            />

            <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="auth-input"
            >
                <option value="mahasiswa">Mahasiswa</option>
                <option value="admin">Admin</option>
            </select>

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="auth-input"
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="auth-input"
                minLength={6}
                required
            />

            <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Mendaftarkan..." : "Register"}
            </button>
            </form>

            <p className="auth-alt-text">
            Sudah punya akun?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
            </p>
        </div>
        </div>
    );
};

export default RegisterPage;
