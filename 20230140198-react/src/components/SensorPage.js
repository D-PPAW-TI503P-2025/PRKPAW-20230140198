import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import "./../styles/AppTheme.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorPage() {
  const [chartSuhuLembab, setChartSuhuLembab] = useState({ labels: [], datasets: [] });
  const [chartCahaya, setChartCahaya] = useState({ labels: [], datasets: [] });
  const [latest, setLatest] = useState({ suhu: "-", lembab: "-", cahaya: "-" });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/iot/history');
      const data = res.data.data || [];
      if (data.length === 0) return;

      const labels = data.map(item =>
        new Date(item.createdAt).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );

      const suhu = data.map(i => i.suhu);
      const lembab = data.map(i => i.kelembaban);
      const cahaya = data.map(i => i.cahaya);

      setLatest({
        suhu: suhu[suhu.length - 1],
        lembab: lembab[lembab.length - 1],
        cahaya: cahaya[cahaya.length - 1],
      });

      setChartSuhuLembab({
        labels,
        datasets: [
          {
            label: 'Suhu (°C)',
            data: suhu,
            borderColor: 'rgb(255,99,132)',
            backgroundColor: 'rgba(255,99,132,0.4)',
            tension: 0.3
          },
          {
            label: 'Kelembaban (%)',
            data: lembab,
            borderColor: 'rgb(53,162,235)',
            backgroundColor: 'rgba(53,162,235,0.4)',
            tension: 0.3
          }
        ]
      });

      setChartCahaya({
        labels,
        datasets: [
          {
            label: 'Cahaya (LDR)',
            data: cahaya,
            borderColor: 'rgb(250,204,21)',
            backgroundColor: 'rgba(250,204,21,0.4)',
            tension: 0.3
          }
        ]
      });

      setLoading(false);
    } catch (err) {
      console.error("Gagal ambil data sensor:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  return (
    <div className="app-container">
      <h2 style={{ color:"#555", marginBottom:15, fontSize:'24px', fontWeight:700 }}>
        Dashboard IoT
      </h2>

      {/* Kartu Indikator */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
        <div className="card" style={{ background:'#fee2e2', color:'#991b1b', textAlign:'center' }}>
          <h4>Suhu</h4>
          <h2>{latest.suhu} °C</h2>
        </div>
        <div className="card" style={{ background:'#dbeafe', color:'#1e3a8a', textAlign:'center' }}>
          <h4>Kelembaban</h4>
          <h2>{latest.lembab} %</h2>
        </div>
        <div className="card" style={{ background:'#fef9c3', color:'#92400e', textAlign:'center' }}>
          <h4>Cahaya</h4>
          <h2>{latest.cahaya}</h2>
        </div>
      </div>

      {/* Grafik */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
        <div className="card">
          {loading ? <p>Memuat data...</p> : <Line options={options} data={chartSuhuLembab} />}
        </div>
        <div className="card">
          {loading ? <p>Memuat data...</p> : <Line options={options} data={chartCahaya} />}
        </div>
      </div>
    </div>
  );
}

export default SensorPage;
