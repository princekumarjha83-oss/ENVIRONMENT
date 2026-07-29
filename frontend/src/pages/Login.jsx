import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usersAPI } from '../api';
import useStore from '../store';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Eye, EyeOff, Wind } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = mode === 'login'
        ? await usersAPI.login(form.username, form.password)
        : await usersAPI.register(form);
      setUser({ username: res.data.username, role: res.data.role, full_name: res.data.full_name }, res.data.access_token);
      toast.success(`Welcome${mode === 'register' ? ' aboard' : ' back'}, ${res.data.username}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#081C2D', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Animated BG */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.1), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08), transparent)', pointerEvents: 'none' }} />

      <motion.div className='glass' initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        style={{ width: '100%', maxWidth: 420, padding: '2.5rem', margin: '1rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#16A34A,#0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem' }}>
            <Wind size={24} color='white' />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg,#16A34A,#0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EcoWatch AI</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(226,240,255,0.45)', marginTop: 4 }}>Environmental Monitoring Platform</div>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 4, marginBottom: '1.5rem' }}>
          {['login','register'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '0.5rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.3s',
              background: mode === m ? 'linear-gradient(135deg,#16A34A,#0EA5E9)' : 'transparent',
              color: mode === m ? 'white' : 'rgba(226,240,255,0.5)' }}>
              {m === 'login' ? '🔐 Login' : '✨ Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <AnimatePresence>
            {mode === 'register' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div style={{ position: 'relative' }}>
                  <User size={16} color='rgba(226,240,255,0.4)' style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input className='eco-input' name='full_name' placeholder='Full Name' value={form.full_name} onChange={handleChange} style={{ paddingLeft: 38 }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ position: 'relative' }}>
            <User size={16} color='rgba(226,240,255,0.4)' style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input className='eco-input' name='username' placeholder='Username' value={form.username} onChange={handleChange} required style={{ paddingLeft: 38 }} />
          </div>

          <AnimatePresence>
            {mode === 'register' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color='rgba(226,240,255,0.4)' style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input className='eco-input' name='email' type='email' placeholder='Email' value={form.email} onChange={handleChange} style={{ paddingLeft: 38 }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ position: 'relative' }}>
            <Lock size={16} color='rgba(226,240,255,0.4)' style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input className='eco-input' name='password' type={showPass ? 'text' : 'password'} placeholder='Password' value={form.password} onChange={handleChange} required style={{ paddingLeft: 38, paddingRight: 40 }} />
            <button type='button' onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(226,240,255,0.4)', padding: 0 }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type='submit' disabled={loading} className='btn-primary' style={{ padding: '0.8rem', fontSize: '0.95rem', marginTop: 4 }}>
            {loading ? '⏳ Please wait...' : mode === 'login' ? '🚀 Login to EcoWatch' : '✨ Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.78rem', color: 'rgba(226,240,255,0.4)' }}>
          Demo: <strong style={{ color: '#0EA5E9' }}>admin / admin123</strong>
        </div>
      </motion.div>
    </div>
  );
}
