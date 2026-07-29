import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { citiesAPI } from '../api';

export default function CityRanking() {
  const [cities, setCities] = useState([]);
  const [sortBy, setSortBy] = useState('rank');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    citiesAPI.getRankings().then(r => setCities(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const sorted = [...cities].sort((a, b) => {
    if (sortBy === 'aqi') return a.aqi - b.aqi;
    if (sortBy === 'green') return b.green_cover - a.green_cover;
    if (sortBy === 'health') return b.health_score - a.health_score;
    if (sortBy === 'sustainability') return b.sustainability_score - a.sustainability_score;
    return a.rank - b.rank;
  });

  const medalColors = ['#FACC15', '#9CA3AF', '#CD7C00'];

  return (
    <div>
      {/* Sort controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'rgba(226,240,255,0.5)', alignSelf: 'center' }}>Sort by:</span>
        {[['rank','🏆 Overall'],['aqi','🌍 Best AQI'],['green','🌿 Green Cover'],['health','💚 Health'],['sustainability','🌱 Sustainability']].map(([val,lbl]) => (
          <button key={val} onClick={() => setSortBy(val)}
            style={{ padding: '0.38rem 0.9rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 500, fontFamily: 'Poppins', cursor: 'pointer',
              background: sortBy === val ? 'linear-gradient(135deg,#16A34A,#0EA5E9)' : 'rgba(255,255,255,0.07)',
              color: sortBy === val ? 'white' : 'rgba(226,240,255,0.7)',
              border: sortBy === val ? 'none' : '1px solid rgba(255,255,255,0.12)' }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      {sorted.length >= 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {[sorted[1], sorted[0], sorted[2]].map((city, i) => {
            const pos = i === 0 ? 1 : i === 1 ? 0 : 2;
            return (
              <motion.div key={city.name} className='glass' initial={{ opacity: 0, y: i === 1 ? -20 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pos * 0.15 }}
                style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid ${medalColors[pos]}`, order: pos === 0 ? 0 : pos === 1 ? -1 : 1 }}>
                <div style={{ fontSize: pos === 0 ? '2.5rem' : '2rem', marginBottom: 8 }}>
                  {pos === 0 ? '🥇' : pos === 1 ? '🥈' : '🥉'}
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: medalColors[pos] }}>{city.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.5)', margin: '4px 0' }}>{city.country}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: medalColors[pos] }}>{city.sustainability_score}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(226,240,255,0.4)' }}>Sustainability Score</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '2px 8px' }}>AQI: {city.aqi}</span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '2px 8px' }}>🌿 {city.green_cover}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full table */}
      <div className='glass' style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Rank','City','AQI','Temperature','Green Cover','Health','Sustainability'].map(h => (
                  <th key={h} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(226,240,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((city, i) => (
                <motion.tr key={city.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.8rem 1rem', fontSize: '0.9rem', fontWeight: 700, color: i < 3 ? medalColors[i] : 'rgba(226,240,255,0.6)' }}>#{i + 1}</td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 600, fontSize: '0.88rem' }}>{city.name}</td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: city.aqi_category?.color || '#E2F0FF', fontSize: '0.9rem' }}>{city.aqi}</td>
                  <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem', color: 'rgba(226,240,255,0.75)' }}>{city.temperature}°C</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${city.green_cover}%`, height: '100%', background: '#16A34A', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16A34A' }}>{city.green_cover}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: city.health_score >= 60 ? '#16A34A' : '#FACC15', fontSize: '0.88rem' }}>{city.health_score}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${city.sustainability_score}%`, height: '100%', background: 'linear-gradient(90deg,#16A34A,#0EA5E9)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0EA5E9' }}>{city.sustainability_score}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
