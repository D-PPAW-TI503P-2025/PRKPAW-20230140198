import React, { useState } from "react";
import axios from "axios";

function PresensiPage() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const getToken = () => localStorage.getItem("token");

    const handleCheckIn = async () => {
        try {
        setError("");
        const config = {
            headers: {
            Authorization: `Bearer ${getToken()}`,
            },
        };

        const res = await axios.post(
            "http://localhost:3001/api/presensi/check-in",
            {},
            config
        );

        setMessage(res.data.message);
        } catch (err) {
        setError(
            err.response ? err.response.data.message : "Check-in gagal"
        );
        }
    };

    const handleCheckOut = async () => {
        try {
        setError("");
        const config = {
            headers: {
            Authorization: `Bearer ${getToken()}`,
            },
        };

        const res = await axios.post(
            "http://localhost:3001/api/presensi/check-out",
            {},
            config
        );

        setMessage(res.data.message);
        } catch (err) {
        setError(
            err.response ? err.response.data.message : "Check-out gagal"
        );
        }
    };

    return (
        <div style={{ padding: "20px" }}>
        <h2>Halaman Presensi</h2>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={handleCheckIn} style={{ marginRight: "10px" }}>
            Check-In
        </button>
        <button onClick={handleCheckOut}>Check-Out</button>
        </div>
    );
}

export default PresensiPage;
