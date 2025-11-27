import React from "react";
import "./../styles/AppTheme.css";

const DashboardPage = () => {
    return (
        <div className="app-container">
        <div style={{marginTop:18}} className="dashboard-grid">
            <div>
            <div className="card">
                <h3>Selamat datang di Dashboard</h3>
                <p>Ringkasan cepat aktivitas presensi dan laporan.</p>
                <div style={{marginTop:12}}>
                <div style={{display:"flex", gap:12}}>
                    <div className="card" style={{flex:1}}>
                    <h4 style={{marginTop:0}}>Kehadiran Hari Ini</h4>
                    <p style={{color:"var(--muted)"}}>Belum ada data realtime</p>
                    </div>
                    <div className="card" style={{width:260}}>
                    <h4 style={{marginTop:0}}>Status Akun</h4>
                    <p style={{color:"var(--muted)"}}>Aman & Terverifikasi</p>
                    </div>
                </div>
                </div>
            </div>
            </div>

            <aside>
            <div className="card">
                <h4>Notifikasi</h4>
                <p style={{color:"var(--muted)"}}>Tidak ada notifikasi.</p>
            </div>
            </aside>
        </div>
        </div>
    );
};

export default DashboardPage;
