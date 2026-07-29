import { useState } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { darkMode, toggleDarkMode, selectedCity, setCity } = useStore();
  const [notifs, setNotifs] = useState({ aqi: true, weather: true, news: false, reports: true });
  const [lang, setLang] = useState('English');

  return (
    <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Appearance */}
      <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.2rem', color: '#0EA5E9' }}>🎨 Appearance</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Dark Mode</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(226,240,255,0.4)' }}>Toggle between dark and light themes</div>
          </div>
          <button onClick={toggleDarkMode} style={{ width: 52, height: 28, borderRadius: 14, background: darkMode ? '#16A34A' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }}>
            <motion.div animate={{ x: darkMode ? 26 : 2 }} style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 3 }} />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Language</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(226,240,255,0.4)' }}>Select your preferred language</div>
          </div>
          <select value={lang} onChange={e => setLang(e.target.value)} className='eco-input' style={{ width: 160 }}>
            {['English','Hindi','Tamil','Telugu','Bengali','Marathi'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Location */}
      <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.2rem', color: '#16A34A' }}>📍 Default Location</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <select value={selectedCity} onChange={e => setCity(e.target.value)} className='eco-input'>
            {['Delhi','Mumbai','Bangalore','Chennai','Kolkata','Hyderabad','Pune','Jaipur','Kochi','Chandigarh'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className='btn-primary' onClick={() => toast.success(`Default city set to ${selectedCity}`)}>Save</button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ padding: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.2rem', color: '#FACC15' }}>🔔 Notifications</h3>
        {[['aqi','AQI Alert Threshold','Get notified when AQI exceeds safe limits'],['weather','Severe Weather Alerts','Heatwave, flood, and storm notifications'],['news','Environmental News','Daily eco news digest'],['reports','Report Ready','Alert when scheduled reports are ready']].map(([key,label,desc]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{label}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(226,240,255,0.4)' }}>{desc}</div>
            </div>
            <button onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
              style={{ width: 48, height: 26, borderRadius: 13, background: notifs[key] ? '#16A34A' : 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }}>
              <motion.div animate={{ x: notifs[key] ? 24 : 2 }} style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 3 }} />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Save */}
      <button className='btn-primary' onClick={() => toast.success('✅ Settings saved successfully!')} style={{ padding: '0.8rem', fontSize: '0.95rem', alignSelf: 'flex-start' }}>
        💾 Save All Settings
      </button>
    </div>
  );
}
