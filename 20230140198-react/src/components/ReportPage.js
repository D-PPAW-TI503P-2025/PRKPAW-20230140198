import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./../styles/AppTheme.css";

function ReportPage() {
  const [reports,setReports] = useState([]);
  const [error,setError] = useState(null);
  const [searchTerm,setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchReports = async (nama="") => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`http://localhost:3001/api/reports/daily?nama=${nama}`, config);
      setReports(res.data.data || []);
      setError(null);
    } catch (err) {
      setError("Gagal mengambil laporan");
    }
  };

  useEffect(()=>{ fetchReports(""); }, []);

  const handleSearchSubmit = (e) => { e.preventDefault(); fetchReports(searchTerm); };

  return (
    <div className="app-container">
      <div className="card" style={{marginTop:18}}>
        <h3>Laporan Presensi Harian</h3>

        <form onSubmit={handleSearchSubmit} style={{display:"flex", gap:12, alignItems:"center", marginTop:8}}>
          <input className="input" placeholder="Cari nama..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
          <button className="btn-primary" type="submit">Cari</button>
        </form>

        {error && <p style={{color:"red"}}>{error}</p>}

        <div style={{overflowX:"auto", marginTop:12}}>
          <table className="table" role="table" aria-label="Laporan Presensi">
            <thead>
              <tr>
                <th>Nama</th><th>Check-In</th><th>Check-Out</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? reports.map(r => (
                <tr key={r.id}>
                  <td>{r.nama || "N/A"}</td>
                  <td>{r.checkIn}</td>
                  <td>{r.checkOut || "Belum Check-Out"}</td>
                </tr>
              )) : (
                <tr><td colSpan="3">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
