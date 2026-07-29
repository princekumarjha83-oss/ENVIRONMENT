import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { Wind } from 'lucide-react';

function AnimatedGlobe() {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });
  return (
    <Sphere ref={meshRef} args={[1.8, 64, 64]}>
      <MeshDistortMaterial
        color='#0EA5E9'
        attach='material'
        distort={0.35}
        speed={1.5}
        roughness={0}
        metalness={0.2}
        opacity={0.85}
        transparent
        wireframe={false}
      />
    </Sphere>
  );
}

function ParticleRing() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.15;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.5, 0.02, 16, 100]} />
      <meshBasicMaterial color='#16A34A' opacity={0.5} transparent />
    </mesh>
  );
}

const stats = [
  { label: 'Cities Monitored', value: '15+', icon: '🌍' },
  { label: 'Active Sensors', value: '1,247', icon: '📡' },
  { label: 'AI Analyses Done', value: '54K+', icon: '🤖' },
  { label: 'Reports Generated', value: '3,812', icon: '📄' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#081C2D', overflow: 'hidden', position: 'relative' }}>
      {/* Animated background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#16A34A,#0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wind size={18} color='white' />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(135deg,#16A34A,#0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EcoWatch AI</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/login')} className='btn-secondary' style={{ padding: '0.45rem 1.2rem' }}>Login</button>
          <button onClick={() => navigate('/dashboard')} className='btn-primary' style={{ padding: '0.45rem 1.2rem' }}>Dashboard →</button>
        </div>
      </header>

      {/* Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', alignItems: 'center', padding: '6rem 3rem 3rem', gap: '2rem', position: 'relative', zIndex: 1 }}>
        {/* Left content */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 30, padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
            <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 600 }}>AI-Powered Environmental Intelligence</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Monitor Our Planet<br />
            <span style={{ background: 'linear-gradient(135deg, #16A34A, #0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              With AI Precision
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ fontSize: '1.05rem', color: 'rgba(226,240,255,0.65)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 500 }}>
            A professional AI platform monitoring air quality, predicting environmental conditions,
            analyzing pollution images, and providing intelligent sustainability recommendations in real-time.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/dashboard')} className='btn-primary' style={{ padding: '0.8rem 2rem', fontSize: '1rem', borderRadius: 14 }}>
              🚀 Start Monitoring
            </button>
            <button onClick={() => navigate('/copilot')} className='btn-secondary' style={{ padding: '0.8rem 2rem', fontSize: '1rem', borderRadius: 14 }}>
              🤖 Try AI Copilot
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '2.5rem' }}>
            {stats.map((s, i) => (
              <motion.div key={s.label} className='glass' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.1 }}
                style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg,#16A34A,#0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(226,240,255,0.5)', marginTop: 2 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: 3D Globe */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
          style={{ height: 520, position: 'relative' }}>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color='#0EA5E9' />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color='#16A34A' />
            <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
            <AnimatedGlobe />
            <ParticleRing />
          </Canvas>
          {/* Glow overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(14,165,233,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        </motion.div>
      </div>

      {/* Feature pills */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
        style={{ position: 'relative', zIndex: 1, padding: '0 3rem 4rem', display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['🌍 Real-time AQI', '📸 AI Image Analysis', '🤖 Copilot Chat', '📈 Pollution Predictions', '📄 PDF Reports', '🏆 City Rankings', '🧮 Carbon Calculator', '🗺️ Interactive Map'].map(tag => (
          <span key={tag} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 30, padding: '0.4rem 1rem', fontSize: '0.82rem', color: 'rgba(226,240,255,0.75)' }}>{tag}</span>
        ))}
      </motion.div>
    </div>
  );
}
