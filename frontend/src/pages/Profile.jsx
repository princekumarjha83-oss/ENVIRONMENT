import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usersAPI } from '../api';
import useStore from '../store';
import toast from 'react-hot-toast';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const { user } = useStore();

  useEffect(() => {
    if (user) {
      usersAPI.getProfile().then(r => setProfile(r.data)).catch(() => {});
    }
  }, [user]);

  if (!user) return (
    <div className='glass' style={{ padding: '3rem', textAlign: 'center', color: 'rgba(226,240,255,0.4)' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
      <div style={{ fontWeight: 600 }}>Please login to view your profile</div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
      {/* Profile card */}
      <motion.div className='glass' initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#16A34A,#0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem' }}>
          {user.username[0].toUpperCase()}
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{profile?.full_name || user.username}</div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(226,240,255,0.5)', marginTop: 4 }}>@{user.username}</div>
        {user.role === 'admin' && (
          <span style={{ display: 'inline-block', marginTop: 8, fontSize: '0.7rem', background: 'rgba(250,204,21,0.15)', color: '#FACC15', padding: '3px 12px', borderRadius: 20, border: '1px solid rgba(250,204,21,0.3)' }}>
            👑 Administrator
          </span>
        )}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[['📧', 'Email', profile?.email || '—'],['📅', 'Member Since', profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'],['🛡️', 'Role', profile?.role || user.role]].map(([ico, lbl, val]) => (
            <div key={lbl} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '0.6rem', display: 'flex', gap: 8, textAlign: 'left' }}>
              <span>{ico}</span>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(226,240,255,0.4)' }}>{lbl}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{val}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activity */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <motion.div className='glass' initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1.2rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', color: '#0EA5E9' }}>📊 Activity Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {[['12', 'Reports Generated', '📄', '#16A34A'], ['47', 'Images Analyzed', '📸', '#0EA5E9'], ['89', 'Queries Made', '💬', '#9333EA']].map(([v,l,i,c]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem' }}>{i}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: c, margin: '4px 0' }}>{v}</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(226,240,255,0.45)' }}>{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className='glass' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ padding: '1.2rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', color: '#FACC15' }}>🕐 Recent Activity</h3>
          {[['Generated Delhi Environmental Report', '2 hours ago', '📄'],['Analyzed garbage dump image — Plastic Waste', '5 hours ago', '📸'],['Carbon footprint calculated: 245 kg CO₂', '1 day ago', '🧮'],['Asked EcoBot about AQI levels', '1 day ago', '🤖'],['Viewed 7-day forecast for Mumbai', '2 days ago', '📈']].map(([act, time, ico]) => (
            <div key={act} style={{ display: 'flex', gap: 10, padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>{ico}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.82rem', color: 'rgba(226,240,255,0.8)' }}>{act}</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(226,240,255,0.35)', marginTop: 2 }}>{time}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
