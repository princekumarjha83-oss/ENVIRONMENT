import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardAPI } from '../api';
import useStore from '../store';

function CircularGauge({ score, size = 180 }) {
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? '#16A34A' : score >= 40 ? '#FACC15' : '#EF4444';
  const label = score >= 70 ? 'Healthy' : score >= 40 ? 'Moderate' : 'Critical';

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill='none' stroke='rgba(255,255,255,0.08)' strokeWidth={16} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill='none'
          stroke={color} strokeWidth={16}
          strokeLinecap='round'
          strokeDasharray={`${circ} ${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          style={{ fontSize: '2.5rem', fontWeight: 900, color }}>
          {score}
        </motion.div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.5)' }}>/ 100</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

export default function HealthScore() {
  const [metrics, setMetrics] = useState(null);
  const { selectedCity } = useStore();

  useEffect(() => {
    dashboardAPI.getMetrics(selectedCity).then(r => setMetrics(r.data)).catch(() => {});
  }, [selectedCity]);

  if (!metrics) return <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(226,240,255,0.4)' }}>Loading...</div>;

  const score = metrics.health_score;
  const color = score >= 70 ? '#16A34A' : score >= 40 ? '#FACC15' : '#EF4444';

  const factors = [
    { label: 'Air Quality (AQI)', weight: '40%', val: Math.max(0, 100 - metrics.aqi / 3.5), icon: '🌍' },
    { label: 'Temperature', weight: '20%', val: Math.max(0, 100 - Math.max(0, metrics.temperature - 30) * 5), icon: '🌡️' },
    { label: 'Water Quality', weight: '20%', val: metrics.water_quality, icon: '💧' },
    { label: 'Green Cover', weight: '15%', val: metrics.green_cover, icon: '🌿' },
    { label: 'Wind Quality', weight: '5%', val: Math.max(0, 100 - metrics.wind_speed * 1.5), icon: '🌬️' },
  ];

  const aiExplanation = score >= 70
    ? `The environmental health of ${selectedCity} is currently GOOD. Air quality, green cover, and temperature are within acceptable ranges. Continue monitoring and maintain current sustainability practices.`
    : score >= 40
    ? `The environmental health of ${selectedCity} requires ATTENTION. AQI levels are elevated and green cover needs improvement. Immediate action on vehicle emissions and urban greening is recommended.`
    : `The environmental health of ${selectedCity} is in CRITICAL condition. Hazardous pollution levels detected. Emergency measures including traffic restrictions, industrial shutdowns, and public health advisories are urgently needed.`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem' }}>
      {/* Score gauge */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <motion.div className='glass' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(226,240,255,0.5)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: 1 }}>Environmental Health Score</div>
          <CircularGauge score={score} size={200} />
          <div style={{ marginTop: '1.2rem', fontSize: '0.9rem', color: 'rgba(226,240,255,0.6)' }}>
            City: <strong style={{ color: '#0EA5E9' }}>{selectedCity}</strong>
          </div>
        </motion.div>

        <div className='glass' style={{ padding: '1.2rem', borderLeft: `3px solid ${color}` }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0EA5E9', marginBottom: 8 }}>🤖 AI Explanation</div>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.7, color: 'rgba(226,240,255,0.7)' }}>{aiExplanation}</p>
        </div>
      </div>

      {/* Factors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className='glass' style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>📊 Score Breakdown by Factor</h3>
          {factors.map((f, i) => (
            <motion.div key={f.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              style={{ marginBottom: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{f.icon} {f.label}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(226,240,255,0.4)', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '1px 6px' }}>Weight: {f.weight}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: f.val >= 70 ? '#16A34A' : f.val >= 40 ? '#FACC15' : '#EF4444' }}>{Math.round(f.val)}</span>
                </div>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${f.val}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                  style={{ height: '100%', borderRadius: 5, background: f.val >= 70 ? 'linear-gradient(90deg,#16A34A,#22C55E)' : f.val >= 40 ? 'linear-gradient(90deg,#FACC15,#F59E0B)' : 'linear-gradient(90deg,#EF4444,#DC2626)' }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {[
            { label: 'AQI', val: metrics.aqi, icon: '🌍', color: '#EF4444' },
            { label: 'Green Cover', val: `${metrics.green_cover}%`, icon: '🌿', color: '#16A34A' },
            { label: 'Water Quality', val: `${metrics.water_quality}%`, icon: '💧', color: '#0EA5E9' },
          ].map(s => (
            <div key={s.label} className='glass' style={{ padding: '1rem', textAlign: 'center', borderTop: `2px solid ${s.color}` }}>
              <div style={{ fontSize: '1.3rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, margin: '4px 0' }}>{s.val}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(226,240,255,0.5)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className='glass' style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: '#FACC15' }}>💡 Improvement Actions</h3>
          {(score < 100) && [
            score < 80 && '🌳 Increase urban green cover — target 30% tree canopy coverage',
            score < 70 && '🚗 Implement vehicle emission controls and odd-even schemes',
            score < 60 && '🏭 Enforce stricter industrial emission standards',
            score < 50 && '🚨 Issue public health advisory and restrict outdoor activities',
            '☀️ Promote rooftop solar to reduce energy-based pollution',
          ].filter(Boolean).map((tip, i) => (
            <div key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.82rem', color: 'rgba(226,240,255,0.7)' }}>{tip}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
