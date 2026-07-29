import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { imageAPI } from '../api';
import { Upload, Image, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageAnalysis() {
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setLoading(true);
    try {
      const res = await imageAPI.analyze(file);
      setResult(res.data);
      toast.success('Analysis complete!');
    } catch {
      toast.error('Analysis failed — ensure backend is running');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': ['.jpg','.jpeg','.png','.webp'] }, maxFiles: 1
  });

  const SAMPLE_NAMES = [
    { name: 'garbage_dump.jpg', label: '🗑️ Garbage' },
    { name: 'smoke_factory.jpg', label: '💨 Smoke' },
    { name: 'forest_fire.jpg', label: '🔥 Fire' },
    { name: 'polluted_river.jpg', label: '🌊 River' },
    { name: 'deforestation_forest.jpg', label: '🌳 Forest' },
  ];

  const testSample = async (filename) => {
    const blob = new Blob(['fake'], { type: 'image/jpeg' });
    const file = new File([blob], filename, { type: 'image/jpeg' });
    setPreview(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await imageAPI.analyze(file);
      setResult(res.data);
    } catch {
      toast.error('Backend offline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Upload panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div {...getRootProps()} style={{
          border: `2px dashed ${isDragActive ? '#16A34A' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: 20, padding: '2.5rem 1.5rem', textAlign: 'center', cursor: 'pointer',
          background: isDragActive ? 'rgba(22,163,74,0.08)' : 'rgba(255,255,255,0.04)',
          transition: 'all 0.3s', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12
        }}>
          <input {...getInputProps()} />
          {loading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(22,163,74,0.2)', borderTop: '3px solid #16A34A' }} />
          ) : preview ? (
            <img src={preview} alt='preview' style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 12, objectFit: 'cover' }} />
          ) : (
            <>
              <Upload size={36} color={isDragActive ? '#16A34A' : 'rgba(226,240,255,0.3)'} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'rgba(226,240,255,0.7)' }}>
                {isDragActive ? 'Drop image here!' : 'Drag & drop or click to upload'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.4)' }}>Supports JPG, PNG, WebP</div>
            </>
          )}
        </div>

        {/* Sample buttons */}
        <div className='glass' style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', color: 'rgba(226,240,255,0.6)' }}>🧪 Test with Sample Images:</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SAMPLE_NAMES.map(s => (
              <button key={s.name} onClick={() => testSample(s.name)} className='btn-secondary' style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className='glass' style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0EA5E9' }}>📋 Detectable Categories</div>
          {[
            ['🗑️', 'Garbage / Solid Waste', 'Plastic, organic waste, littering'],
            ['💨', 'Smoke / Air Pollution', 'Industrial smoke, smog, haze'],
            ['🔥', 'Forest Fire', 'Wildfire, burning vegetation'],
            ['🌊', 'Water Pollution', 'River/lake contamination, oil spills'],
            ['🌳', 'Deforestation', 'Land clearing, logging, habitat loss'],
          ].map(([icon, cat, desc]) => (
            <div key={cat} style={{ display: 'flex', gap: 10, padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '1.2rem' }}>{icon}</span>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{cat}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(226,240,255,0.45)' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results panel */}
      <AnimatePresence>
        {result ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className='glass' style={{ padding: '1.5rem', borderLeft: `4px solid ${result.color}` }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.45)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>AI Detection Result</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: result.color, marginBottom: 6 }}>{result.prediction}</div>

              {/* Confidence bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                  <span style={{ color: 'rgba(226,240,255,0.5)' }}>AI Confidence</span>
                  <span style={{ fontWeight: 700, color: result.color }}>{result.confidence}%</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 1, delay: 0.3 }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${result.color}, rgba(${result.color},0.5))`, borderRadius: 4 }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: result.color + '22', color: result.color, border: `1px solid ${result.color}44` }}>
                  {result.severity} Severity
                </span>
              </div>

              {/* Detected objects */}
              {result.objects && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(226,240,255,0.6)', marginBottom: 6 }}>Detected Objects:</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {result.objects.map(o => (
                      <span key={o} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', color: 'rgba(226,240,255,0.7)' }}>{o}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='glass' style={{ padding: '1.2rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0EA5E9', marginBottom: 8 }}>🤖 AI Explanation</div>
              <p style={{ fontSize: '0.83rem', color: 'rgba(226,240,255,0.7)', lineHeight: 1.7 }}>{result.explanation}</p>
            </div>

            <div className='glass' style={{ padding: '1.2rem', borderLeft: '3px solid #16A34A' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16A34A', marginBottom: 8 }}>✅ Suggested Action</div>
              <p style={{ fontSize: '0.83rem', color: 'rgba(226,240,255,0.7)', lineHeight: 1.7 }}>{result.action}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: 'rgba(226,240,255,0.3)', textAlign: 'center' }}>
            <Image size={64} strokeWidth={1} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 8 }}>No Image Analyzed Yet</div>
              <div style={{ fontSize: '0.82rem' }}>Upload an environmental image or<br />click a sample button to test the AI</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
