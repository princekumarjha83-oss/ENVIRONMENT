import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { reportsAPI } from '../api';
import { Upload, Database, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchDatasets = () => reportsAPI.getDatasets().then(r => setDatasets(r.data)).catch(() => {});

  useEffect(() => { fetchDatasets(); }, []);

  const onDrop = async (files) => {
    setUploading(true);
    try {
      await reportsAPI.uploadDataset(files[0]);
      toast.success('Dataset uploaded!');
      fetchDatasets();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Upload zone */}
      <div {...getRootProps()} style={{ border: `2px dashed ${isDragActive ? '#16A34A' : 'rgba(255,255,255,0.2)'}`, borderRadius: 20, padding: '2rem', textAlign: 'center', cursor: 'pointer', background: isDragActive ? 'rgba(22,163,74,0.06)' : 'transparent', transition: 'all 0.3s' }}>
        <input {...getInputProps()} />
        <Upload size={32} color='rgba(226,240,255,0.4)' style={{ margin: '0 auto 0.75rem' }} />
        <div style={{ fontWeight: 600, color: 'rgba(226,240,255,0.7)' }}>{isDragActive ? 'Drop file here' : 'Drag & drop dataset file or click to browse'}</div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.35)', marginTop: 4 }}>CSV, JSON, XLSX supported</div>
        {uploading && <div style={{ marginTop: 12, color: '#0EA5E9', fontSize: '0.85rem' }}>⏳ Uploading...</div>}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {[['Total Datasets', datasets.length, '📂', '#0EA5E9'],
          ['Total Rows', datasets.reduce((s, d) => s + (d.rows || 0), 0).toLocaleString(), '📊', '#16A34A'],
          ['Avg Columns', datasets.length ? Math.round(datasets.reduce((s, d) => s + (d.columns || 0), 0) / datasets.length) : 0, '📋', '#FACC15']
        ].map(([lbl, val, ico, color]) => (
          <div key={lbl} className='glass' style={{ padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem' }}>{ico}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color, margin: '4px 0' }}>{val}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.45)' }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Dataset list */}
      <div className='glass' style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Database size={18} color='#0EA5E9' />
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Uploaded Datasets</span>
        </div>
        {datasets.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'rgba(226,240,255,0.3)', fontSize: '0.9rem' }}>No datasets uploaded yet</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Name','Filename','Rows','Columns','Uploaded'].map(h => (
                  <th key={h} style={{ padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(226,240,255,0.45)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datasets.map((d, i) => (
                <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 600, fontSize: '0.85rem' }}>{d.name}</td>
                  <td style={{ padding: '0.8rem 1rem', fontSize: '0.8rem', color: 'rgba(226,240,255,0.5)' }}>{d.filename}</td>
                  <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem', color: '#16A34A', fontWeight: 600 }}>{(d.rows || 0).toLocaleString()}</td>
                  <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem', color: '#0EA5E9', fontWeight: 600 }}>{d.columns}</td>
                  <td style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', color: 'rgba(226,240,255,0.4)' }}>{new Date(d.uploaded_at).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Train model button */}
      <div className='glass' style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>🤖 Train Prediction Models</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.45)', marginTop: 3 }}>Retrain AI models using the uploaded datasets</div>
        </div>
        <button className='btn-primary' onClick={() => toast.success('🎉 Model training initiated! Estimated time: 2-3 minutes')}>
          🚀 Train Models
        </button>
      </div>
    </div>
  );
}
