import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import { dashboardAPI } from '../api';
import useStore from '../store';
import toast from 'react-hot-toast';

const CITIES = ['Delhi','Mumbai','Bangalore','Chennai','Kolkata','Hyderabad','Pune','Ahmedabad','Jaipur','Kochi'];

const CARD_CONFIG = [
  { key: 'aqi', label: 'Air Quality Index', icon: '🌍', unit: '', color: '#EF4444' },
  { key: 'temperature', label: 'Temperature', icon: '🌡️', unit: '°C', color: '#F97316' },
  { key: 'humidity', label: 'Humidity', icon: '💧', unit: '%', color: '#0EA5E9' },
  { key: 'wind_speed', label: 'Wind Speed', icon: '🌬️', unit: 'km/h', color: '#8B5CF6' },
  { key: 'rainfall', label: 'Rainfall', icon: '🌧️', unit: 'mm', color: '#06B6D4' },
  { key: 'uv_index', label: 'UV Index', icon: '☀️', unit: '', color: '#FACC15' },
  { key: 'health_score', label: 'Health Score', icon: '🌱', unit: '/100', color: '#16A34A' },
  { key: 'green_cover', label: 'Green Cover', icon: '🌿', unit: '%', color: '#22C55E' },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedCity, setCity } = useStore();

  const fetchData = async () => {
    try {
      const [mRes, hRes] = await Promise.all([
        dashboardAPI.getMetrics(selectedCity),
        dashboardAPI.getHistory(selectedCity, 14),
      ]);
      setMetrics(mRes.data);
      setHistory(hRes.data);
    } catch {
      toast.error('Backend offline — check FastAPI is running');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [selectedCity]);
  useEffect(() => { const t = setInterval(fetchData, 30000); return () => clearInterval(t); }, [selectedCity]);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#16A34A';
    if (aqi <= 100) return '#FACC15';
    if (aqi <= 150) return '#F97316';
    if (aqi <= 200) return '#EF4444';
    return '#9333EA';
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        style={{ width: 50, height: 50, borderRadius: '50%', border: '3px solid rgba(22,163,74,0.2)', borderTop: '3px solid #16A34A' }} />
      <p style={{ color: 'rgba(226,240,255,0.5)', fontSize: '0.9rem' }}>Loading live environmental data...</p>
    </div>
  );

  return (
    <div>
      {/* City selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: 'rgba(226,240,255,0.55)' }}>Select City:</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CITIES.map(city => (
            <button key={city} onClick={() => setCity(city)}
              style={{ padding: '0.35rem 0.9rem', borderRadius: 30, fontSize: '0.78rem', fontWeight: 500, fontFamily: 'Poppins', cursor: 'pointer', transition: 'all 0.2s',
                background: selectedCity === city ? 'linear-gradient(135deg,#16A34A,#0EA5E9)' : 'rgba(255,255,255,0.07)',
                color: selectedCity === city ? 'white' : 'rgba(226,240,255,0.7)',
                border: selectedCity === city ? 'none' : '1px solid rgba(255,255,255,0.12)' }}>
              {city}
            </button>
          ))}
        </div>
        <button onClick={fetchData} style={{ marginLeft: 'auto', background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 10, padding: '0.35rem 0.9rem', color: '#0EA5E9', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'Poppins' }}>
          ↻ Refresh
        </button>
      </div>

      {/* AQI Badge */}
      {metrics && (
        <motion.div className='glass' initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 16, borderLeft: `4px solid ${getAQIColor(metrics.aqi)}` }}>
          <div style={{ fontSize: '2rem' }}>{metrics.aqi_category?.emoji}</div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>Current Air Quality — {selectedCity}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: getAQIColor(metrics.aqi) }}>{metrics.aqi_category?.label}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '2.5rem', fontWeight: 900, color: getAQIColor(metrics.aqi) }}>{metrics.aqi}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.4)' }}>AQI</div>
        </motion.div>
      )}

      {/* Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {CARD_CONFIG.map((cfg, i) => (
          <StatCard
            key={cfg.key}
            icon={cfg.icon}
            label={cfg.label}
            value={metrics ? metrics[cfg.key] : '—'}
            unit={cfg.unit}
            color={cfg.color}
            index={i}
            subtitle={metrics?.aqi_category?.label && cfg.key === 'aqi' ? metrics.aqi_category.label : undefined}
          />
        ))}
      </div>

      {/* Charts */}
      {history.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ padding: '1.2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'rgba(226,240,255,0.9)' }}>📈 AQI Trend (14 Days)</h3>
            <ResponsiveContainer width='100%' height={200}>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id='aqiGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#EF4444' stopOpacity={0.4} />
                    <stop offset='95%' stopColor='#EF4444' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.06)' />
                <XAxis dataKey='date' tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0D2137', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 10, color: '#E2F0FF', fontSize: '0.8rem' }} />
                <Area type='monotone' dataKey='aqi' stroke='#EF4444' fill='url(#aqiGrad)' strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ padding: '1.2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'rgba(226,240,255,0.9)' }}>🌡️ Temperature Trend</h3>
            <ResponsiveContainer width='100%' height={200}>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id='tempGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#F97316' stopOpacity={0.4} />
                    <stop offset='95%' stopColor='#F97316' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.06)' />
                <XAxis dataKey='date' tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0D2137', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 10, color: '#E2F0FF', fontSize: '0.8rem' }} />
                <Area type='monotone' dataKey='temperature' stroke='#F97316' fill='url(#tempGrad)' strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ padding: '1.2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'rgba(226,240,255,0.9)' }}>💧 Humidity & Rainfall</h3>
            <ResponsiveContainer width='100%' height={200}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.06)' />
                <XAxis dataKey='date' tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0D2137', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 10, color: '#E2F0FF', fontSize: '0.8rem' }} />
                <Line type='monotone' dataKey='humidity' stroke='#0EA5E9' strokeWidth={2} dot={false} />
                <Line type='monotone' dataKey='rainfall' stroke='#06B6D4' strokeWidth={2} dot={false} strokeDasharray='5 3' />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ padding: '1.2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'rgba(226,240,255,0.9)' }}>🌫️ PM2.5 Levels</h3>
            <ResponsiveContainer width='100%' height={200}>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id='pmGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#9333EA' stopOpacity={0.4} />
                    <stop offset='95%' stopColor='#9333EA' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.06)' />
                <XAxis dataKey='date' tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0D2137', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 10, color: '#E2F0FF', fontSize: '0.8rem' }} />
                <Area type='monotone' dataKey='pm25' stroke='#9333EA' fill='url(#pmGrad)' strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Pollutants detail */}
      {metrics && (
        <motion.div className='glass' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ padding: '1.2rem', marginTop: '1rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>🧪 Air Pollutant Breakdown</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {[
              { label: 'PM2.5', val: metrics.pm25, unit: 'µg/m³', safe: 60 },
              { label: 'PM10', val: metrics.pm10, unit: 'µg/m³', safe: 100 },
              { label: 'CO₂', val: metrics.co2, unit: 'ppm', safe: 450 },
              { label: 'NO₂', val: metrics.no2, unit: 'µg/m³', safe: 80 },
              { label: 'SO₂', val: metrics.so2, unit: 'µg/m³', safe: 50 },
              { label: 'O₃', val: metrics.o3, unit: 'µg/m³', safe: 100 },
            ].map(p => (
              <div key={p.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.5)' }}>{p.label}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: p.val > p.safe ? '#EF4444' : '#16A34A', margin: '4px 0' }}>{p.val}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(226,240,255,0.35)' }}>{p.unit}</div>
                <div style={{ fontSize: '0.62rem', color: p.val > p.safe ? '#EF4444' : '#16A34A', marginTop: 2 }}>{p.val > p.safe ? '⚠ High' : '✓ Safe'}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
