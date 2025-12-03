import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./../styles/AppTheme.css"; 
import L from "leaflet";

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const token = localStorage.getItem("token");

  // Ambil lokasi
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setError("Gagal lokasi: " + err.message)
      );
    } else { setError("Browser tidak support geolocation."); }
  };

  // Start Kamera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { setError("Kamera error: " + err.message); }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhotoURL(canvas.toDataURL("image/jpeg"));
    setMessage(""); setError("");
  };

  useEffect(() => {
    getLocation();
    startCamera();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handlePresensi = async (type) => {
    if (!coords && type === "check-in") return setError("Tunggu lokasi ditemukan...");
    try {
      const data = type === "check-in" ? { latitude: coords.lat, longitude: coords.lng } : {};
      const url = `http://localhost:3001/api/presensi/${type}`;
      
      const res = await axios.post(url, data, { headers: { Authorization: `Bearer ${token}` } });
      setMessage(res.data.message);
      setError("");
      setPhotoURL(null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memproses data");
    }
  };

  const customIcon = new L.Icon({
    // Menggunakan gambar pin merah dari repository leaflet-color-markers
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],     // Ukuran icon
    iconAnchor: [12, 41],   // Titik penunjuk (bagian bawah tengah jarum)
    popupAnchor: [1, -34],  // Posisi popup relative terhadap icon
    shadowSize: [41, 41]
  });

  return (
    <div className="app-container">
      <h2 style={{color : "#555", marginTop: 0, marginBottom: 15, fontSize: '24px', fontWeight: 700 }}>Halaman Presensi</h2>

      {/* Grid Layout: Kiri Peta, Kanan Kamera */}
      <div className="presensi-container">
        
        {/* KOLOM 1: PETA */}
        <div className="card" style={{padding:0, overflow:'hidden', minHeight: '400px', display:'flex', flexDirection:'column'}}>
          {coords ? (
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={16}
              style={{ flex:1, width: "100%", zIndex: 10 }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker 
                position={[coords.lat, coords.lng]} 
                icon={customIcon} // <--- Tambahkan baris ini
              >
                <Popup>
                  <div style={{textAlign: 'center'}}>
                    <b>Posisi Anda Saat Ini</b><br/>
                    <small>{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</small>
                  </div>
                  </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'#eee'}}>
              <p>Mencari titik lokasi...</p>
            </div>
          )}
          <div style={{padding:16, background:'#fff', borderTop:'1px solid #eee'}}>
              <small style={{color:'#666'}}>*Pastikan Anda berada di dalam radius kantor.</small>
          </div>
        </div>

        {/* KOLOM 2: KAMERA & AKSI */}
        <div className="card">
            <h3 style={{color:'#777', marginTop:0 , marginBottom:10}}>Verifikasi Wajah</h3>
            
            <div style={{position:'relative', marginBottom:16}}>
                {!photoURL ? (
                    <video ref={videoRef} autoPlay className="camera-preview" style={{height:'240px'}} />
                ) : (
                    <img src={photoURL} alt="Captured" className="camera-preview" style={{height:'240px'}} />
                )}
                
                {/* Tombol Ambil Foto overlay atau di bawah */}
            </div>

            {!photoURL ? (
                <button onClick={takePhoto} className="btn-action btn-camera">
                   Ambil Foto
                </button>
            ) : (
                <button onClick={() => setPhotoURL(null)} className="btn-action" style={{background:'#64748b', color:'white', marginBottom:12}}>
                   Foto Ulang
                </button>
            )}

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div style={{display:'flex', gap:10, marginTop: 10}}>
                <button onClick={() => handlePresensi("check-in")} className="btn-action btn-checkin" disabled={!photoURL}>
                    Check-In
                </button>
                <button onClick={() => handlePresensi("check-out")} className="btn-action btn-checkout">
                    Check-Out
                </button>
            </div>

            {/* Notifikasi Message */}
            {message && (
                <div style={{marginTop:16, padding:10, background:'#dcfce7', color:'#166534', borderRadius:8, fontSize:14, textAlign:'center'}}>
                    {message}
                </div>
            )}
            {error && (
                <div style={{marginTop:16, padding:10, background:'#fee2e2', color:'#991b1b', borderRadius:8, fontSize:14, textAlign:'center'}}>
                    {error}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

export default PresensiPage;