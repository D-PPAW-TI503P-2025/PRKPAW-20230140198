import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    const fetchReports = async (nama = "") => {
        const token = localStorage.getItem("token");
        if (!token) {
        navigate("/login");
        return;
        }

        try {
        const config = {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };

        const res = await axios.get(
            `http://localhost:3001/api/reports/daily?nama=${nama}`,
            config
        );

        setReports(res.data.data);
        setError(null);
        } catch (err) {
        setError("Gagal mengambil laporan");
        }
    };

    useEffect(() => {
        fetchReports("");
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchReports(searchTerm);
    };

    return (
        <div style={{ padding: "20px" }}>
        <h1>Laporan Presensi Harian</h1>

        <form onSubmit={handleSearchSubmit}>
            <input
            type="text"
            placeholder="Cari nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Cari</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!error && (
            <table border="1" cellPadding="6" style={{ marginTop: "20px" }}>
            <thead>
                <tr>
                <th>Nama</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                </tr>
            </thead>

            <tbody>
                {reports.length > 0 ? (
                reports.map((p) => (
                    <tr key={p.id}>
                    <td>{p.user ? p.user.nama : "N/A"}</td>
                    <td>{p.checkIn}</td>
                    <td>{p.checkOut ?? "Belum Check-Out"}</td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="3">Tidak ada data</td>
                </tr>
                )}
            </tbody>
            </table>
        )}
        </div>
    );
}

export default ReportPage;