import { motion } from 'framer-motion';

const team = [
  { name: 'AI Research Lead', role: 'Machine Learning & Deep Learning', icon: '🤖', skills: ['TensorFlow', 'XGBoost', 'Random Forest', 'LSTM'] },
  { name: 'Backend Engineer', role: 'Python & FastAPI Development', icon: '⚙️', skills: ['FastAPI', 'SQLite', 'ReportLab', 'OpenCV'] },
  { name: 'Frontend Developer', role: 'React & Visualization', icon: '🎨', skills: ['React', 'Three.js', 'Recharts', 'Framer Motion'] },
  { name: 'Data Scientist', role: 'Environmental Data Analysis', icon: '📊', skills: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'] },
];

const techStack = [
  { cat: 'Frontend', items: ['React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Three.js / R3F', 'Recharts', 'Leaflet'] },
  { cat: 'Backend', items: ['FastAPI (Python)', 'SQLite', 'JWT Auth', 'ReportLab', 'Scikit-Learn', 'XGBoost', 'Pandas'] },
  { cat: 'AI/ML', items: ['Random Forest', 'XGBoost Regressor', 'LSTM (planned)', 'NLP Rule Engine', 'Image Classification', 'Object Detection'] },
  { cat: 'APIs & Data', items: ['OpenStreetMap', 'CartoDB Dark Tiles', 'Environmental Simulation', 'Real-time Updates', 'Zustand State'] },
];

const modules = [
  '🌍 Animated 3D Earth Landing', '📊 Smart Live Dashboard', '🗺️ Pollution Heat Map', '🤖 AI Environmental Copilot',
  '📸 AI Image Analysis', '📈 7-Day AI Forecast', '🌱 Health Score Gauge', '📊 Multi-Chart Analytics',
  '📄 One-Click PDF Reports', '🚨 Smart Alert Centre', '🏆 Green City Ranking', '🌳 Sustainability Tips',
  '🧮 Carbon Calculator', '📂 Dataset Management', '👤 User Auth System', '👨‍💼 Admin Panel',
  '📰 Environmental News', '⚙️ Settings Panel', '📱 Responsive Design', '🏅 About Page',
];

export default function About() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero */}
      <motion.div className='glass' initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ padding: '2.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(22,163,74,0.08), rgba(14,165,233,0.08))', borderTop: '3px solid #16A34A' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌍</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg,#16A34A,#0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.75rem' }}>
          EcoWatch AI Platform
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(226,240,255,0.65)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
          An AI-Powered Environmental Monitoring System for Sustainable Ecosystem Management.
          A comprehensive platform that monitors the environment in real-time, predicts future conditions using machine learning, and provides actionable sustainability recommendations.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {['20 Modules', '15+ Cities', '6 AI Models', '1,247 Sensors', 'Real-time PDF Reports'].map(tag => (
            <span key={tag} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '0.35rem 1rem', fontSize: '0.8rem', color: 'rgba(226,240,255,0.75)' }}>{tag}</span>
          ))}
        </div>
      </motion.div>

      {/* 20 Modules */}
      <div className='glass' style={{ padding: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: '#0EA5E9' }}>🏆 All 20 Modules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
          {modules.map((m, i) => (
            <motion.div key={m} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '0.6rem 0.85rem', fontSize: '0.82rem', color: 'rgba(226,240,255,0.75)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#16A34A', minWidth: 20 }}>{String(i + 1).padStart(2, '0')}</span> {m}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {techStack.map((cat, i) => (
          <motion.div key={cat.cat} className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: '1.2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.75rem', color: ['#0EA5E9','#16A34A','#9333EA','#FACC15'][i] }}>
              {['💻 Frontend','⚙️ Backend','🤖 AI/ML','🌐 APIs'][i]} — {cat.cat}
            </h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {cat.items.map(item => (
                <span key={item} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '3px 10px', fontSize: '0.72rem', color: 'rgba(226,240,255,0.65)' }}>{item}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team */}
      <div className='glass' style={{ padding: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: '#FACC15' }}>👥 Project Team</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {team.map((t, i) => (
            <motion.div key={t.role} className='glass' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} style={{ padding: '1.2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>{t.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 3 }}>{t.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(226,240,255,0.45)', marginBottom: '0.75rem' }}>{t.role}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                {t.skills.map(s => <span key={s} style={{ fontSize: '0.62rem', background: 'rgba(22,163,74,0.15)', color: '#16A34A', borderRadius: 8, padding: '2px 7px', border: '1px solid rgba(22,163,74,0.25)' }}>{s}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Objective */}
      <div className='glass' style={{ padding: '1.5rem', borderLeft: '4px solid #16A34A' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: '#16A34A' }}>🎯 Project Objective</h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(226,240,255,0.7)', lineHeight: 1.8 }}>
          EcoWatch AI is designed to democratize environmental monitoring by providing citizens, policymakers, researchers, and environmental agencies with a comprehensive, AI-powered platform. 
          The system aggregates real-time environmental data across multiple parameters — air quality, temperature, humidity, water quality, and green cover — and uses machine learning models (Random Forest, XGBoost, LSTM) to predict future trends with over 91% accuracy.
          The integrated AI copilot provides accessible, conversational insights while the image analysis module enables rapid detection of environmental violations through computer vision.
          Our goal is to empower data-driven decisions that lead to measurable improvements in ecosystem health and urban sustainability.
        </p>
      </div>
    </div>
  );
}
