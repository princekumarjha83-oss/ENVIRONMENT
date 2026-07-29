import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { alertsAPI } from '../api';
import { Bell, BellOff, X } from 'lucide-react';
import toast from 'react-hot-toast';

const SEVERITY_CONFIG = {
  danger: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', icon: '🚨' },
  warning: { color: '#FACC15', bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.3)', icon: '⚠️' },
  info: { color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.3)', icon: 'ℹ️' },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alertsAPI.getAlerts().then(r => setAlerts(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const dismiss = async (id) => {
    await alertsAPI.dismiss(id).catch(() => {});
    setAlerts(a => a.filter(al => al.id !== id));
    toast.success('Alert dismissed');
  };

  const counts = alerts.reduce((a, al) => { a[al.severity] = (a[al.severity] || 0) + 1; return a; }, {});

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[['danger','🚨','Critical Alerts'], ['warning','⚠️','Warnings'], ['info','ℹ️','Info Alerts']].map(([sev, ico, lbl]) => (
          <motion.div key={sev} className='glass' initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '1.2rem', textAlign: 'center', borderTop: `3px solid ${SEVERITY_CONFIG[sev]?.color}` }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>{ico}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: SEVERITY_CONFIG[sev]?.color }}>{counts[sev] || 0}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(226,240,255,0.5)', marginTop: 2 }}>{lbl}</div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {alerts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='glass'
            style={{ padding: '3rem', textAlign: 'center', color: 'rgba(226,240,255,0.3)' }}>
            <BellOff size={48} strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>No Active Alerts</div>
            <div style={{ fontSize: '0.8rem', marginTop: 6 }}>All clear — environment is stable</div>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alerts.map((alert, i) => {
              const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
              return (
                <motion.div key={alert.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 16, padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: 12, borderLeft: `4px solid ${cfg.color}` }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{cfg.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: cfg.color }}>{alert.type}</span>
                      <span style={{ fontSize: '0.65rem', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, padding: '1px 8px', color: cfg.color, fontWeight: 700, textTransform: 'uppercase' }}>{alert.severity}</span>
                      {alert.city && <span style={{ fontSize: '0.7rem', color: 'rgba(226,240,255,0.45)' }}>📍 {alert.city}</span>}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(226,240,255,0.8)', lineHeight: 1.5 }}>{alert.message}</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(226,240,255,0.35)', marginTop: 4 }}>{new Date(alert.created_at).toLocaleString()}</div>
                  </div>
                  <button onClick={() => dismiss(alert.id)}
                    style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '0.4rem', cursor: 'pointer', color: 'rgba(226,240,255,0.5)', flexShrink: 0 }}>
                    <X size={15} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Alert types legend */}
      <div className='glass' style={{ marginTop: '1.5rem', padding: '1.2rem' }}>
        <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: '#FACC15' }}>📋 Alert Types Monitored</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.6rem' }}>
          {[['🌫️','High AQI','danger'],['🌡️','Heatwave','warning'],['🌊','Flood Risk','danger'],['🔥','Fire Risk','danger'],['🌧️','Heavy Rainfall','warning'],['💨','Storm Alert','warning']].map(([ico,lbl,sev]) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem', background: SEVERITY_CONFIG[sev]?.bg, borderRadius: 10 }}>
              <span>{ico}</span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(226,240,255,0.7)' }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
