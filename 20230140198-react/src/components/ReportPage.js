import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/AppTheme.css";


function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");

  const token = localStorage.getItem("token");

  // Format Tanggal
  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date)) return value;
    
    // Format: 27 Nov 2025, 15:30
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(date);
  };

  const formatCoord = (val) => {
    if (val === null || val === undefined) return "-";
    const num = Number(val);
    return Number.isNaN(num) ? val : num.toFixed(6);
  };

  const fetchReports = async (nama = "") => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/reports/daily?nama=${nama}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(res.data.data || []);
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data laporan.");
    }
  };

  useEffect(() => {
    fetchReports("");
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports(searchName);
  };

  return (
    <div className="app-container">
      {/* Header Section */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{color : "#555", marginTop: 0, marginBottom: 4, fontSize: '24px', fontWeight: 700 }}>
           Laporan Presensi
        </h2>
      </div>

      <div className="card">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
            className="search-input"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button className="btn-search" type="submit">
            Cari Data
          </button>
        </form>

        {error && (
            <div style={{ padding: 12, background: '#fee2e2', color: '#991b1b', borderRadius: 8, marginBottom: 16 }}>
                {error}
            </div>
        )}

        {/* TABEL RESPONSIF */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{width: '50px'}}>ID</th>
                <th>Nama Pengguna</th>
                <th>Email</th>
                <th>Waktu Check-In</th>
                <th>Waktu Check-Out</th>
                <th>Lokasi (Lat, Lng)</th>
              </tr>
            </thead>

            <tbody>
              {reports.length > 0 ? (
                reports.map((item) => {
                  const user = item.user || {};
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>#{item.userId ?? user.id ?? "-"}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{user.nama ?? "-"}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{user.role ?? "User"}</div>
                      </td>
                      <td>{user.email ?? "-"}</td>

                      <td>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                            {formatDateTime(item.checkIn)}
                        </span>
                      </td>
                      <td>
                        {item.checkOut ? formatDateTime(item.checkOut) : <span style={{color:'#94a3b8'}}>-</span>}
                      </td>

                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {formatCoord(item.latitude)}, {formatCoord(item.longitude)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
                    Tidak ada data ditemukan untuk pencarian ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;