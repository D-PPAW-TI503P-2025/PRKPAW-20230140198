import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./AuthStyle.css";

const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const response = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } else {
            alert(data.message || "Login gagal!");
        }

        } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan server.");
        }
    };

    return (
        <div className="auth-container">
        <div className="auth-card">
            <h2 className="auth-title">Login</h2>

            <form onSubmit={handleSubmit}>
            <input 
                type="email"
                placeholder="Email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <input 
                type="password"
                placeholder="Password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button className="auth-btn">Login</button>
            </form>

            <p className="auth-alt-text">
            Belum punya akun? <span onClick={() => navigate('/register')}>Register</span>
            </p>
        </div>
        </div>
    );
};

export default LoginPage;
