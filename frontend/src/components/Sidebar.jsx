import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store';
import {
  LayoutDashboard, Map, Bot, Camera, TrendingUp, Heart, BarChart3,
  FileText, Bell, Globe, Leaf, Calculator, Database, Users, Shield,
  Newspaper, Settings, Info, ChevronLeft, ChevronRight, Wind
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/map', label: 'Interactive Map', icon: Map },
  { path: '/copilot', label: 'AI Copilot', icon: Bot },
  { path: '/image-analysis', label: 'Image Analysis', icon: Camera },
  { path: '/predictions', label: 'AI Predictions', icon: TrendingUp },
  { path: '/health-score', label: 'Health Score', icon: Heart },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/reports', label: 'Report Generator', icon: FileText },
  { path: '/alerts', label: 'Alert Centre', icon: Bell },
  { path: '/city-ranking', label: 'City Ranking', icon: Globe },
  { path: '/sustainability', label: 'Sustainability', icon: Leaf },
  { path: '/carbon', label: 'Carbon Calc', icon: Calculator },
  { path: '/datasets', label: 'Datasets', icon: Database },
  { path: '/profile', label: 'My Profile', icon: Users },
  { path: '/admin', label: 'Admin Panel', icon: Shield },
  { path: '/news', label: 'Eco News', icon: Newspaper },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about', label: 'About', icon: Info },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useStore();

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 240 : 72 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        background: 'linear-gradient(180deg, #0A1F35 0%, #081C2D 100%)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        height: '100vh',
        position: 'fixed',
        left: 0, top: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '1.1rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10, minHeight: 64 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #16A34A, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Wind size={18} color='white' />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, background: 'linear-gradient(135deg, #16A34A, #0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EcoWatch AI</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(226,240,255,0.45)', marginTop: -2 }}>Environmental Monitor</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0.4rem 0' }}>
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.6rem 1rem', textDecoration: 'none', color: 'rgba(226,240,255,0.75)', marginBottom: 1 }}>
            <Icon size={18} style={{ flexShrink: 0 }} />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Toggle */}
      <button onClick={toggleSidebar}
        style={{ margin: '0.6rem', padding: '0.45rem', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'rgba(226,240,255,0.7)', display: 'flex', justifyContent: 'center' }}>
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </motion.aside>
  );
}
