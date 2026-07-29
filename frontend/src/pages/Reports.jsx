import { useState } from 'react';
import { motion } from 'framer-motion';
import { reportsAPI } from '../api';
import useStore from '../store';
import { FileText, Download, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const CITIES = ['Delhi','Mumbai','Bangalore','Chennai','Kolkata','Hyderabad','Pune','Jaipur','Kochi','Chandigarh'];

export default function Reports() {
  const [city, setCity] = useState('Delhi');
  const [title, setTitle] = useState('Environmental Monitoring Report');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const res = await reportsAPI.generate({ city, title, include_predictions: true });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EcoWatch_Report_${city}_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setGenerated({ city, time: new Date().toLocaleString() });
      toast.success('✅ PDF Report downloaded!');
    } catch {
      toast.error('Report generation failed — check backend');
    } finally {
      setGenerating(false);
    }
  };

  const reportSections = [
    { icon: '📊', title: 'Current Metrics Table', desc: 'AQI, Temperature, Humidity, Wind, UV, PM2.5, PM10, CO₂, Health Score' },
    { icon: '📈', title: '7-Day Historical Trend', desc: 'Daily AQI, temperature, rainfall, and PM2.5 values' },
    { icon: '🤖', title: 'AI Recommendations', desc: 'Intelligent, context-aware environmental action items' },
    { icon: '⚠️', title: 'Risk Assessment', desc: 'Identified environmental risks and severity levels' },
    { icon: '🌱', title: 'Sustainability Score', desc: 'Overall environmental health score with breakdown' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem' }}>
      {/* Main config */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className='glass' style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem', color: '#0EA5E9' }}>📄 Configure Report</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'rgba(226,240,255,0.6)', display: 'block', marginBottom: 6 }}>Report Title</label>
              <input className='eco-input' value={title} onChange={e => setTitle(e.target.value)} placeholder='Report title...' />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'rgba(226,240,255,0.6)', display: 'block', marginBottom: 6 }}>Select City</label>
              <select className='eco-input' value={city} onChange={e => setCity(e.target.value)}>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button onClick={generateReport} disabled={generating}
              style={{
                background: generating ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#16A34A,#0EA5E9)',
                border: 'none', borderRadius: 14, padding: '0.9rem 2rem', cursor: generating ? 'not-allowed' : 'pointer',
                color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s',
              }}>
              {generating ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating PDF...</> : <><Download size={18} /> Generate AI Report PDF</>}
            </button>
          </div>
        </div>

        {/* What's included */}
        <div className='glass' style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#FACC15' }}>📋 Report Includes</h3>
          {reportSections.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              style={{ display: 'flex', gap: 12, padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(226,240,255,0.45)', marginTop: 2 }}>{s.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preview / Status */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className='glass' style={{ padding: '1.5rem', textAlign: 'center', flex: 1 }}>
          {generated ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#16A34A', marginBottom: 8 }}>Report Generated!</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(226,240,255,0.5)', marginBottom: '0.5rem' }}>City: {generated.city}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(226,240,255,0.5)', marginBottom: '1.5rem' }}>{generated.time}</div>
              <div style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 12, padding: '0.75rem', fontSize: '0.8rem', color: 'rgba(226,240,255,0.7)' }}>
                📥 PDF downloaded to your Downloads folder
              </div>
            </motion.div>
          ) : (
            <>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>📄</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgba(226,240,255,0.4)', marginBottom: 8 }}>Report Preview</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(226,240,255,0.3)' }}>Configure and generate a report<br />to download it as a PDF</div>
            </>
          )}
        </div>

        <div className='glass' style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0EA5E9', marginBottom: '0.75rem' }}>⚡ Report Features</div>
          {['Real A4 PDF format', 'Professional styled tables', 'AI-generated recommendations', 'Timestamped with city details', 'Instant download, no email required'].map(f => (
            <div key={f} style={{ fontSize: '0.8rem', color: 'rgba(226,240,255,0.6)', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 6 }}>
              <span style={{ color: '#16A34A' }}>✓</span> {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
