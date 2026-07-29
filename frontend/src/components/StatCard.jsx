import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, unit = '', color = '#0EA5E9', subtitle, trend, index = 0 }) {
  return (
    <motion.div
      className='glass stat-card'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      style={{ padding: '1.3rem', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: color, opacity: 0.1, filter: 'blur(20px)' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <div style={{ fontSize: '1.5rem' }}>{icon}</div>
        {trend !== undefined && (
          <span style={{ fontSize: '0.7rem', color: trend >= 0 ? '#EF4444' : '#16A34A', background: trend >= 0 ? 'rgba(239,68,68,0.12)' : 'rgba(22,163,74,0.12)', padding: '2px 7px', borderRadius: 20 }}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color, lineHeight: 1 }}>
        {value}<span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(226,240,255,0.55)', marginLeft: 3 }}>{unit}</span>
      </div>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(226,240,255,0.9)', marginTop: 5 }}>{label}</div>
      {subtitle && <div style={{ fontSize: '0.7rem', color: 'rgba(226,240,255,0.45)', marginTop: 2 }}>{subtitle}</div>}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)`, borderRadius: '0 0 20px 20px', opacity: 0.6 }} />
    </motion.div>
  );
}
