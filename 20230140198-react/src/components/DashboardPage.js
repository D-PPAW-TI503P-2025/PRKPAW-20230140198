import React from "react";
import "./../styles/AppTheme.css";

const DashboardPage = () => {
    return (
        <div className="app-container">
            <h2 style={{color: '#444', marginTop: 0, marginBottom: 15, fontSize: '24px', fontWeight: 700 }}>
                Dashboard Overview
            </h2>
            
            {/* GRID LAYOUT: Menggunakan Inline Style untuk memastikan layout terbentuk */}
            <div className="dashboard-grid">
                
                {/* KOLOM KIRI: Welcome & Stat */}
                {/* style height: 100% memastikan card ini mengisi tinggi grid penuh */}
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <h3>Selamat datang di Dashboard</h3>
                    <p style={{ color: "var(--muted)", marginBottom: 30, lineHeight: '1.5' }}>
                        Ringkasan cepat aktivitas presensi dan status akun Anda hari ini.
                    </p>
                    
                    {/* Status Grid kecil di dalam card */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                        <div style={{ background: "#f8fafc", padding: 20, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                            <h4 style={{ marginTop: 0, marginBottom: 8, color: "var(--fb-blue-900)" }}>Kehadiran</h4>
                            <div style={{ fontSize: 14, color: "var(--muted)" }}>Belum ada data check-in hari ini.</div>
                        </div>
                        <div style={{ background: "#f0fdf4", padding: 20, borderRadius: 12, border: "1px solid #bbf7d0" }}>
                            <h4 style={{ marginTop: 0, marginBottom: 8, color: "#166534" }}>Status Akun</h4>
                            <div style={{ fontSize: 14, color: "#166534", fontWeight: 600 }}>Aktif & Terverifikasi</div>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: Notifikasi */}
                {/* Flex column + flex: 1 pada spacer akan mendorong konten agar penuh */}
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <h3>Notifikasi</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                        <div style={{ padding: 12, background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 8 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 4 }}>
                                <small style={{ color: "#2563eb", fontWeight: 600, fontSize: 11 }}>SISTEM</small>
                                <small style={{ color: "#9ca3af", fontSize: 11 }}>Baru saja</small>
                            </div>
                            <div style={{ fontSize: 13, color: '#374151' }}>Selamat datang di sistem presensi online by Yikri_198</div>
                        </div>
                        
                         {/* Spacer Element: Ini trik agar card notifikasi terlihat penuh/sama tinggi dengan kiri */}
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px', border: '2px dashed #e5e7eb', borderRadius: 8, margin: '10px 0' }}>
                            <span style={{ color: '#9ca3af', fontSize: 13, fontStyle: 'italic' }}>Tidak ada notifikasi lainnya</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;