import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { citiesAPI } from '../api';

const IMPACT_COLORS = { 'Very High': '#16A34A', 'High': '#0EA5E9', 'Medium': '#FACC15', 'Low': '#9CA3AF' };
const EFFORT_COLORS = { High: '#EF4444', Medium: '#F97316', Low: '#16A34A' };

export default function Sustainability() {
  const [tips, setTips] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    citiesAPI.getTips().then(r => setTips(r.data)).catch(() => {});
  }, []);

  const categories = ['All', ...new Set(tips.map(t => t.category))];
  const filtered = filter === 'All' ? tips : tips.filter(t => t.category === filter);

  return (
    <div>
      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding: '0.38rem 1rem', borderRadius: 20, fontSize: '0.78rem', fontFamily: 'Poppins', cursor: 'pointer',
              background: filter === c ? 'linear-gradient(135deg,#16A34A,#0EA5E9)' : 'rgba(255,255,255,0.07)',
              color: filter === c ? 'white' : 'rgba(226,240,255,0.7)',
              border: filter === c ? 'none' : '1px solid rgba(255,255,255,0.12)' }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map((tip, i) => (
          <motion.div key={tip.id} className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ padding: '1.3rem' }}
            whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(22,163,74,0.15)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: '0.9rem' }}>
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>{tip.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{tip.title}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(226,240,255,0.45)' }}>Category: {tip.category}</div>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'rgba(226,240,255,0.7)', lineHeight: 1.6, marginBottom: '0.9rem' }}>{tip.description}</p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: 20, background: (IMPACT_COLORS[tip.impact] || '#6B7280') + '22', color: IMPACT_COLORS[tip.impact] || '#6B7280', border: `1px solid ${(IMPACT_COLORS[tip.impact] || '#6B7280')}44`, fontWeight: 600 }}>
                Impact: {tip.impact}
              </span>
              <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: 20, background: (EFFORT_COLORS[tip.effort] || '#6B7280') + '22', color: EFFORT_COLORS[tip.effort] || '#6B7280', border: `1px solid ${(EFFORT_COLORS[tip.effort] || '#6B7280')}44`, fontWeight: 600 }}>
                Effort: {tip.effort}
              </span>
            </div>

            {(tip.co2_offset_kg || tip.water_save_liters || tip.plastic_reduce_kg) && (
              <div style={{ background: 'rgba(22,163,74,0.08)', borderRadius: 10, padding: '0.6rem 0.8rem', fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>
                🌱 {tip.co2_offset_kg ? `Saves ~${tip.co2_offset_kg} kg CO₂/year` : ''}
                {tip.water_save_liters ? `Saves ~${(tip.water_save_liters/1000).toFixed(0)}K liters/year` : ''}
                {tip.plastic_reduce_kg ? `Reduces ~${tip.plastic_reduce_kg} kg plastic/year` : ''}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
