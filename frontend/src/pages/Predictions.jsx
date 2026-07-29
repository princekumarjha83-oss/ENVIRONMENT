import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { predictionsAPI } from '../api';
import useStore from '../store';
import toast from 'react-hot-toast';

const CITIES = ['Delhi','Mumbai','Bangalore','Chennai','Kolkata','Hyderabad','Pune','Jaipur'];

function getAQIColor(aqi) {
  if (aqi <= 50) return '#16A34A';
  if (aqi <= 100) return '#FACC15';
  if (aqi <= 150) return '#F97316';
  if (aqi <= 200) return '#EF4444';
  return '#9333EA';
}

export default function Predictions() {
  const [data, setData] = useState(null);
  const [models, setModels] = useState([]);
  const [risks, setRisks] = useState(null);
  const [loading, setLoading] = useState(true);
  const { selectedCity, setCity } = useStore();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      predictionsAPI.getForecast(selectedCity),
      predictionsAPI.getModels(),
      predictionsAPI.getRisk(selectedCity),
    ]).then(([f, m, r]) => {
      setData(f.data); setModels(m.data); setRisks(r.data);
    }).catch(() => toast.error('Backend offline')).finally(() => setLoading(false));
  }, [selectedCity]);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(22,163,74,0.2)', borderTop: '3px solid #16A34A' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* City select + model info */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={selectedCity} onChange={e => setCity(e.target.value)} className='eco-input' style={{ width: 160 }}>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {data && <span style={{ fontSize: '0.78rem', color: 'rgba(226,240,255,0.5)', background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '4px 12px' }}>Model: {data.model_used} • Accuracy: {data.accuracy}</span>}
        {risks?.risks?.length > 0 && risks.risks.map(r => (
          <span key={r.type} style={{ fontSize: '0.75rem', background: r.level === 'Critical' ? 'rgba(239,68,68,0.15)' : 'rgba(250,204,21,0.15)', color: r.level === 'Critical' ? '#EF4444' : '#FACC15', borderRadius: 20, padding: '4px 12px', border: `1px solid ${r.level === 'Critical' ? 'rgba(239,68,68,0.3)' : 'rgba(250,204,21,0.3)'}` }}>
            ⚠️ {r.type}: {r.level}
          </span>
        ))}
      </div>

      {/* 7-Day forecast cards */}
      {data?.predictions && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.8rem', color: 'rgba(226,240,255,0.8)' }}>📅 7-Day AQI Forecast</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.6rem' }}>
            {data.predictions.map((p, i) => (
              <motion.div key={p.day} className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                style={{ padding: '0.85rem 0.5rem', textAlign: 'center', borderTop: `3px solid ${getAQIColor(p.aqi)}` }}>
                <div style={{ fontSize: '0.68rem', color: 'rgba(226,240,255,0.5)', marginBottom: 4 }}>{p.day.slice(0,3)}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: getAQIColor(p.aqi) }}>{p.aqi}</div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(226,240,255,0.45)' }}>AQI</div>
                <div style={{ fontSize: '0.72rem', marginTop: 6 }}>{p.temperature}°C</div>
                <div style={{ fontSize: '0.62rem', color: '#0EA5E9' }}>💧{p.rainfall}mm</div>
                <div style={{ fontSize: '0.6rem', marginTop: 4, color: p.risk_level === 'High' ? '#EF4444' : p.risk_level === 'Moderate' ? '#FACC15' : '#16A34A', fontWeight: 600 }}>{p.risk_level}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Charts row */}
      {data?.predictions && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className='glass' style={{ padding: '1.2rem' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.8rem' }}>📈 AQI Prediction Trend</h3>
            <ResponsiveContainer width='100%' height={180}>
              <LineChart data={data.predictions}>
                <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.06)' />
                <XAxis dataKey='day' tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} tickFormatter={d => d.slice(0,3)} />
                <YAxis tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: '#0D2137', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 10, color: '#E2F0FF', fontSize: '0.78rem' }} />
                <ReferenceLine y={100} stroke='#FACC15' strokeDasharray='4 2' />
                <ReferenceLine y={200} stroke='#EF4444' strokeDasharray='4 2' />
                <Line type='monotone' dataKey='aqi' stroke='#0EA5E9' strokeWidth={2.5} dot={{ fill: '#0EA5E9', strokeWidth: 0, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className='glass' style={{ padding: '1.2rem' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.8rem' }}>🌡️ Temperature Forecast</h3>
            <ResponsiveContainer width='100%' height={180}>
              <BarChart data={data.predictions}>
                <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.06)' />
                <XAxis dataKey='day' tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} tickFormatter={d => d.slice(0,3)} />
                <YAxis tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: '#0D2137', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 10, color: '#E2F0FF', fontSize: '0.78rem' }} />
                <Bar dataKey='temperature' fill='#F97316' radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ML Models */}
      {models.length > 0 && (
        <div className='glass' style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.9rem', color: '#0EA5E9' }}>🤖 AI Models Used</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {models.map(m => (
              <div key={m.name} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '1rem', borderLeft: `3px solid ${m.status === 'Active' ? '#16A34A' : '#6B7280'}` }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.5)', marginBottom: 6 }}>{m.type} • {m.features} features</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16A34A' }}>{m.accuracy}</span>
                  <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 10, background: m.status === 'Active' ? 'rgba(22,163,74,0.15)' : 'rgba(107,114,128,0.15)', color: m.status === 'Active' ? '#16A34A' : '#6B7280' }}>{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
