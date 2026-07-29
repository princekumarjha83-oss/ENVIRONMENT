import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { carbonAPI } from '../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#0EA5E9', '#16A34A', '#F97316', '#FACC15', '#9333EA'];

export default function Carbon() {
  const [form, setForm] = useState({ electricity_kwh: 200, vehicle_km: 500, flights_hours: 0, lpg_kg: 10, fuel_liters: 30 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: parseFloat(e.target.value) || 0 }));

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await carbonAPI.calculate(form);
      setResult(res.data);
      toast.success('Carbon footprint calculated!');
    } catch {
      toast.error('Calculation failed — check backend');
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    { name: 'electricity_kwh', label: '⚡ Monthly Electricity', unit: 'kWh', icon: '💡', max: 1000 },
    { name: 'vehicle_km', label: '🚗 Monthly Vehicle Distance', unit: 'km', icon: '🚗', max: 3000 },
    { name: 'flights_hours', label: '✈️ Monthly Flight Hours', unit: 'hrs', icon: '✈️', max: 50 },
    { name: 'lpg_kg', label: '🔥 Monthly LPG Usage', unit: 'kg', icon: '🔥', max: 50 },
    { name: 'fuel_liters', label: '⛽ Monthly Fuel (Petrol/Diesel)', unit: 'liters', icon: '⛽', max: 200 },
  ];

  const pieData = result ? Object.entries(result.breakdown).map(([k, v]) => ({
    name: { electricity: 'Electricity', vehicle: 'Vehicle', flights: 'Flights', lpg: 'LPG', fuel: 'Fuel' }[k],
    value: v,
  })) : [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Input form */}
      <div className='glass' style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem', color: '#0EA5E9' }}>🧮 Enter Your Monthly Usage</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {inputs.map(inp => (
            <div key={inp.name}>
              <label style={{ fontSize: '0.8rem', color: 'rgba(226,240,255,0.6)', display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span>{inp.label}</span>
                <span style={{ color: '#0EA5E9', fontWeight: 600 }}>{form[inp.name]} {inp.unit}</span>
              </label>
              <input type='range' min='0' max={inp.max} name={inp.name} value={form[inp.name]}
                onChange={handleChange} style={{ width: '100%', accentColor: '#16A34A', height: 6, cursor: 'pointer' }} />
              <input type='number' name={inp.name} value={form[inp.name]} onChange={handleChange} className='eco-input' style={{ marginTop: 4 }} />
            </div>
          ))}
          <button onClick={calculate} disabled={loading} className='btn-primary' style={{ padding: '0.8rem', fontSize: '0.95rem', marginTop: 4 }}>
            {loading ? '⏳ Calculating...' : '🌍 Calculate Carbon Footprint'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {result ? (
            <>
              <motion.div className='glass' initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ padding: '1.5rem', textAlign: 'center', borderTop: `3px solid ${result.category === 'Low' ? '#16A34A' : result.category === 'Average' ? '#FACC15' : '#EF4444'}` }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.45)', textTransform: 'uppercase', letterSpacing: 1 }}>Monthly Footprint</div>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                  style={{ fontSize: '3rem', fontWeight: 900, color: result.category === 'Low' ? '#16A34A' : result.category === 'Average' ? '#FACC15' : '#EF4444', margin: '0.5rem 0' }}>
                  {result.monthly_kg_co2} kg
                </motion.div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(226,240,255,0.55)' }}>CO₂ Equivalent</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0EA5E9' }}>{result.annual_kg_co2}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(226,240,255,0.4)' }}>kg CO₂/year</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#16A34A' }}>{result.trees_to_offset}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(226,240,255,0.4)' }}>trees to offset</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: result.vs_average > 0 ? '#EF4444' : '#16A34A' }}>{result.vs_average > 0 ? '+' : ''}{result.vs_average}%</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(226,240,255,0.4)' }}>vs India avg</div>
                  </div>
                </div>
              </motion.div>

              <motion.div className='glass' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ padding: '1.2rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.8rem' }}>📊 Breakdown by Source</h4>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ResponsiveContainer width='50%' height={150}>
                    <PieChart>
                      <Pie data={pieData} cx='50%' cy='50%' innerRadius={35} outerRadius={65} dataKey='value'>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#0D2137', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 8, color: '#E2F0FF', fontSize: '0.75rem' }} formatter={(v) => [`${v} kg CO₂`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1 }}>
                    {pieData.map((p, i) => (
                      <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i], flexShrink: 0 }} />
                        <span style={{ fontSize: '0.75rem', flex: 1, color: 'rgba(226,240,255,0.65)' }}>{p.name}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{p.value} kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div className='glass' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ padding: '1.2rem', borderLeft: '3px solid #16A34A' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16A34A', marginBottom: 8 }}>💡 AI Suggestions</h4>
                {result.suggestions.map((s, i) => (
                  <div key={i} style={{ fontSize: '0.82rem', color: 'rgba(226,240,255,0.7)', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>✅ {s}</div>
                ))}
              </motion.div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='glass'
              style={{ padding: '3rem', textAlign: 'center', color: 'rgba(226,240,255,0.3)', flex: 1 }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌍</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Your results will appear here</div>
              <div style={{ fontSize: '0.8rem', marginTop: 6 }}>Fill in your usage data and click calculate</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
