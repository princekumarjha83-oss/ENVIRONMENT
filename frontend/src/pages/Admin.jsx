import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usersAPI, dashboardAPI } from '../api';
import useStore from '../store';
import toast from 'react-hot-toast';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const { user } = useStore();

  useEffect(() => {
    if (user?.role === 'admin') {
      usersAPI.getAllUsers().then(r => setUsers(r.data)).catch(() => toast.error('Login as admin to view users'));
      dashboardAPI.getGlobalStats().then(r => setStats(r.data)).catch(() => {});
    }
  }, [user]);

  if (!user || user.role !== 'admin') return (
    <div className='glass' style={{ padding: '3rem', textAlign: 'center', color: 'rgba(226,240,255,0.4)' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
      <div style={{ fontWeight: 600 }}>Admin Access Required</div>
      <div style={{ fontSize: '0.8rem', marginTop: 6 }}>Login with admin/admin123 to access this panel</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Platform stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[['🌍', 'Cities', stats.total_cities_monitored, '#0EA5E9'],['📡', 'Sensors', stats.sensors_active.toLocaleString(), '#16A34A'],['🤖', 'AI Analyses', stats.ai_analyses_done.toLocaleString(), '#9333EA'],['📄', 'Reports', stats.reports_generated.toLocaleString(), '#FACC15']].map(([ico,lbl,val,color]) => (
            <div key={lbl} className='glass' style={{ padding: '1.2rem', textAlign: 'center', borderTop: `2px solid ${color}` }}>
              <div style={{ fontSize: '1.5rem' }}>{ico}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color, margin: '4px 0' }}>{val}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(226,240,255,0.45)' }}>{lbl}</div>
            </div>
          ))}
        </div>
      )}

      {/* Users table */}
      <div className='glass' style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0EA5E9' }}>👥 User Management ({users.length} users)</span>
          <button className='btn-primary' style={{ padding: '0.4rem 1rem', fontSize: '0.78rem' }} onClick={() => toast.success('User invite sent!')}>+ Invite User</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['ID','Username','Email','Full Name','Role','Created'].map(h => (
                <th key={h} style={{ padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(226,240,255,0.4)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'rgba(226,240,255,0.4)' }}>#{u.id}</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem' }}>{u.username}</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'rgba(226,240,255,0.55)' }}>{u.email}</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem' }}>{u.full_name || '—'}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ fontSize: '0.68rem', padding: '2px 10px', borderRadius: 10, background: u.role === 'admin' ? 'rgba(250,204,21,0.15)' : 'rgba(14,165,233,0.15)', color: u.role === 'admin' ? '#FACC15' : '#0EA5E9', fontWeight: 700, textTransform: 'uppercase' }}>{u.role}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'rgba(226,240,255,0.35)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {[['🔄 Refresh Data','Sync environmental sensors','#0EA5E9'],['📊 Export Analytics','Download system analytics CSV','#16A34A'],['⚙️ System Config','Manage API keys and thresholds','#9333EA']].map(([lbl, desc, color]) => (
          <button key={lbl} onClick={() => toast.success(`${lbl.split(' ')[1]} action triggered!`)}
            style={{ background: `${color}14`, border: `1px solid ${color}33`, borderRadius: 14, padding: '1.2rem', cursor: 'pointer', textAlign: 'left', color: 'white', fontFamily: 'Poppins', transition: 'all 0.2s' }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>{lbl}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(226,240,255,0.5)' }}>{desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
