import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { newsAPI } from '../api';

const CAT_COLORS = {
  'Renewable Energy': '#FACC15', 'Air Quality': '#0EA5E9', 'Deforestation': '#16A34A',
  'Pollution': '#EF4444', 'Climate Change': '#F97316', 'Technology': '#9333EA',
  'Water Quality': '#06B6D4',
};

export default function News() {
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    newsAPI.getNews().then(r => setNews(r.data)).catch(() => {});
  }, []);

  const categories = ['All', ...new Set(news.map(n => n.category))];
  const filtered = filter === 'All' ? news : news.filter(n => n.category === filter);

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding: '0.35rem 0.9rem', borderRadius: 20, fontSize: '0.78rem', fontFamily: 'Poppins', cursor: 'pointer',
              background: filter === c ? 'linear-gradient(135deg,#16A34A,#0EA5E9)' : 'rgba(255,255,255,0.07)',
              color: filter === c ? 'white' : 'rgba(226,240,255,0.7)',
              border: filter === c ? 'none' : '1px solid rgba(255,255,255,0.12)' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Featured (first item) */}
      {filtered[0] && (
        <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '2rem', marginBottom: '1rem', borderLeft: `4px solid ${CAT_COLORS[filtered[0].category] || '#0EA5E9'}`, display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 16, background: filtered[0].image_color || '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0 }}>
            {filtered[0].category === 'Renewable Energy' ? '☀️' : filtered[0].category === 'Air Quality' ? '🌫️' : filtered[0].category === 'Climate Change' ? '🌡️' : '🌍'}
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.7rem', background: `${CAT_COLORS[filtered[0].category] || '#0EA5E9'}22`, color: CAT_COLORS[filtered[0].category] || '#0EA5E9', padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>
              📌 FEATURED • {filtered[0].category}
            </span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.5rem 0', lineHeight: 1.4 }}>{filtered[0].title}</h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(226,240,255,0.65)', lineHeight: 1.6 }}>{filtered[0].summary}</p>
            <div style={{ fontSize: '0.72rem', color: 'rgba(226,240,255,0.35)', marginTop: 6 }}>{filtered[0].source} • {filtered[0].date}</div>
          </div>
        </motion.div>
      )}

      {/* News grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.slice(1).map((item, i) => (
          <motion.div key={item.id} className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(14,165,233,0.12)' }}
            style={{ padding: '1.2rem', cursor: 'pointer', borderTop: `2px solid ${CAT_COLORS[item.category] || '#0EA5E9'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.68rem', background: `${CAT_COLORS[item.category] || '#0EA5E9'}22`, color: CAT_COLORS[item.category] || '#0EA5E9', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                {item.category}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'rgba(226,240,255,0.3)' }}>{item.date}</span>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>{item.title}</h3>
            <p style={{ fontSize: '0.8rem', color: 'rgba(226,240,255,0.6)', lineHeight: 1.6 }}>{item.summary}</p>
            <div style={{ fontSize: '0.7rem', color: 'rgba(226,240,255,0.35)', marginTop: '0.75rem' }}>📰 {item.source}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
