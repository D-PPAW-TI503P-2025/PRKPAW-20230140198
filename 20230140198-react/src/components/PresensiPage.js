import React, { useState } from "react";
import axios from "axios";
import "./../styles/AppTheme.css";

function PresensiPage() {
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const handleCheckIn = async () => {
    setError(""); setMessage("");
    try {
      const config = { headers: { Authorization: `Bearer ${getToken()}` } };
      const res = await axios.post("http://localhost:3001/api/presensi/check-in", {}, config);
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Check-in gagal");
    }
  };

  const handleCheckOut = async () => {
    setError(""); setMessage("");
    try {
      const config = { headers: { Authorization: `Bearer ${getToken()}` } };
      const res = await axios.post("http://localhost:3001/api/presensi/check-out", {}, config);
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Check-out gagal");
    }
  };

  return (
    <div className="app-container">
      <div className="card" style={{marginTop:18}}>
        <h3>Halaman Presensi</h3>
        <p style={{color:"var(--muted)"}}>Klik Check-In saat tiba, Check-Out saat pulang.</p>

        {message && <p style={{color:"green"}}>{message}</p>}
        {error && <p style={{color:"red"}}>{error}</p>}

        <div className="presensi-actions">
          <button className="action-btn" onClick={handleCheckIn}>Check-In</button>
          <button className="action-btn" onClick={handleCheckOut}>Check-Out</button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
