import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { dashboardAPI } from '../api';
import useStore from '../store';

const COLORS = ['#16A34A', '#0EA5E9', '#F97316', '#9333EA', '#EF4444', '#FACC15', '#06B6D4', '#EC4899'];

export default function Analytics() {
  const [history, setHistory] = useState([]);
  const { selectedCity } = useStore();

  useEffect(() => {
    dashboardAPI.getHistory(selectedCity, 30).then(r => setHistory(r.data)).catch(() => {});
  }, [selectedCity]);

  const monthly = history.reduce((acc, d) => {
    const month = d.date.slice(0, 7);
    if (!acc[month]) acc[month] = { month, aqi: 0, temp: 0, count: 0 };
    acc[month].aqi += d.aqi; acc[month].temp += d.temperature; acc[month].count++;
    return acc;
  }, {});
  const monthlyData = Object.values(monthly).map(m => ({ ...m, aqi: Math.round(m.aqi / m.count), temp: +(m.temp / m.count).toFixed(1) }));

  const radarData = history.length ? [
    { subject: 'AQI', value: Math.min(100, history[history.length - 1]?.aqi || 0) },
    { subject: 'Temp', value: Math.min(100, (history[history.length - 1]?.temperature || 0) * 2) },
    { subject: 'Humidity', value: history[history.length - 1]?.humidity || 0 },
    { subject: 'Rainfall', value: Math.min(100, (history[history.length - 1]?.rainfall || 0) * 2) },
    { subject: 'PM2.5', value: Math.min(100, history[history.length - 1]?.pm25 || 0) },
    { subject: 'CO₂', value: Math.min(100, ((history[history.length - 1]?.co2 || 400) - 350) / 2) },
  ] : [];

  const pieData = [
    { name: 'Vehicles', value: 40 },
    { name: 'Industry', value: 30 },
    { name: 'Construction', value: 15 },
    { name: 'Agriculture', value: 10 },
    { name: 'Others', value: 5 },
  ];

  const tooltipStyle = { background: '#0D2137', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 10, color: '#E2F0FF', fontSize: '0.78rem' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* AQI 30-day trend */}
        <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.8rem' }}>📈 30-Day AQI Trend</h3>
          <ResponsiveContainer width='100%' height={180}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id='g1' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#EF4444' stopOpacity={0.4} />
                  <stop offset='95%' stopColor='#EF4444' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
              <XAxis dataKey='date' tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type='monotone' dataKey='aqi' stroke='#EF4444' fill='url(#g1)' strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly comparison bar */}
        <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.8rem' }}>📊 Monthly Avg AQI</h3>
          <ResponsiveContainer width='100%' height={180}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
              <XAxis dataKey='month' tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} />
              <YAxis tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey='aqi' fill='#0EA5E9' radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar chart */}
        <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.8rem' }}>🕸️ Environmental Radar</h3>
          <ResponsiveContainer width='100%' height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke='rgba(255,255,255,0.1)' />
              <PolarAngleAxis dataKey='subject' tick={{ fill: 'rgba(226,240,255,0.6)', fontSize: 10 }} />
              <Radar name='Value' dataKey='value' stroke='#16A34A' fill='#16A34A' fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.8rem' }}>🥧 Pollution Sources</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ResponsiveContainer width='55%' height={180}>
              <PieChart>
                <Pie data={pieData} cx='50%' cy='50%' innerRadius={40} outerRadius={75} dataKey='value'>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.map((p, i) => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(226,240,255,0.7)', flex: 1 }}>{p.name}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Temperature vs CO2 */}
        <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.8rem' }}>🌡️ Temperature vs CO₂</h3>
          <ResponsiveContainer width='100%' height={180}>
            <LineChart data={history.slice(-14)}>
              <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
              <XAxis dataKey='date' tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} tickFormatter={d => d.slice(5)} />
              <YAxis yAxisId='left' tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} />
              <YAxis yAxisId='right' orientation='right' tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '0.72rem', color: 'rgba(226,240,255,0.6)' }} />
              <Line yAxisId='left' type='monotone' dataKey='temperature' stroke='#F97316' strokeWidth={2} dot={false} name='Temp °C' />
              <Line yAxisId='right' type='monotone' dataKey='co2' stroke='#9333EA' strokeWidth={2} dot={false} name='CO₂ ppm' />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* PM2.5 bar */}
        <motion.div className='glass' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ padding: '1.2rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.8rem' }}>🌫️ PM2.5 Distribution</h3>
          <ResponsiveContainer width='100%' height={180}>
            <BarChart data={history.slice(-14)}>
              <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
              <XAxis dataKey='date' tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fill: 'rgba(226,240,255,0.4)', fontSize: 9 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey='pm25' fill='#9333EA' radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
