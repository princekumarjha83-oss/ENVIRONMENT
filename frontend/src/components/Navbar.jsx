import { motion } from 'framer-motion';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

export default function Navbar({ title = 'Dashboard' }) {
  const { darkMode, toggleDarkMode, user, logout, sidebarOpen } = useStore();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: 'fixed', top: 0, right: 0,
        left: sidebarOpen ? 240 : 72,
        zIndex: 90,
        background: 'rgba(8,28,45,0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 1.5rem',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'left 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ fontSize: '1.05rem', fontWeight: 700, background: 'linear-gradient(135deg,#16A34A,#0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{title}</h1>
        <span style={{ fontSize: '0.65rem', background: 'rgba(22,163,74,0.2)', color: '#16A34A', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(22,163,74,0.3)', animation: 'none' }}>● LIVE</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={toggleDarkMode} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 10, padding: '0.4rem 0.55rem', cursor: 'pointer', color: '#E2F0FF' }}>
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.3rem 0.75rem' }}>
              <User size={15} style={{ color: '#0EA5E9' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{user.username}</span>
              {user.role === 'admin' && <span style={{ fontSize: '0.62rem', background: 'rgba(250,204,21,0.2)', color: '#FACC15', padding: '1px 6px', borderRadius: 10, border: '1px solid rgba(250,204,21,0.3)' }}>ADMIN</span>}
            </div>
            <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '0.35rem 0.7rem', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem' }}>
              <LogOut size={13} /> Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} className='btn-primary' style={{ padding: '0.38rem 1rem', fontSize: '0.8rem' }}>Login</button>
        )}
      </div>
    </motion.header>
  );
}
