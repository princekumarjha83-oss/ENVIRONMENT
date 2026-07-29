import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import { citiesAPI } from '../api';

function getAQIColor(aqi) {
  if (aqi <= 50) return '#16A34A';
  if (aqi <= 100) return '#FACC15';
  if (aqi <= 150) return '#F97316';
  if (aqi <= 200) return '#EF4444';
  if (aqi <= 300) return '#9333EA';
  return '#7F1D1D';
}

export default function MapPage() {
  const [hotspots, setHotspots] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    citiesAPI.getHotspots().then(r => setHotspots(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <p style={{ fontSize: '0.82rem', color: 'rgba(226,240,255,0.5)', marginTop: 2 }}>Real-time pollution data across {hotspots.length} monitoring stations</p>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[['≤50 Good','#16A34A'],['≤100 Moderate','#FACC15'],['≤150 Sensitive','#F97316'],['≤200 Unhealthy','#EF4444'],['≤300 Very Unhealthy','#9333EA'],['300+ Hazardous','#7F1D1D']].map(([l,c]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', color: 'rgba(226,240,255,0.65)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />{l}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div className='glass' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ borderRadius: 20, overflow: 'hidden', height: 480 }}>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', background: '#0D2137' }}
          zoomControl={true} scrollWheelZoom={true}>
          <TileLayer
            url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            attribution='&copy; OpenStreetMap &copy; CartoDB'
          />
          {hotspots.map(spot => (
            <CircleMarker key={spot.name} center={[spot.lat, spot.lon]}
              radius={Math.max(12, spot.aqi / 15)}
              fillColor={getAQIColor(spot.aqi)}
              color={getAQIColor(spot.aqi)}
              fillOpacity={0.75}
              weight={2}
              eventHandlers={{ click: () => setSelected(spot) }}>
              <Popup>
                <div style={{ fontFamily: 'Poppins', minWidth: 180 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{spot.name}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    <div><span style={{ color: '#6B7280', fontSize: '0.72rem' }}>AQI</span><br /><b style={{ color: getAQIColor(spot.aqi) }}>{spot.aqi}</b></div>
                    <div><span style={{ color: '#6B7280', fontSize: '0.72rem' }}>PM2.5</span><br /><b>{spot.pm25} µg/m³</b></div>
                    <div><span style={{ color: '#6B7280', fontSize: '0.72rem' }}>Temp</span><br /><b>{spot.temperature}°C</b></div>
                    <div><span style={{ color: '#6B7280', fontSize: '0.72rem' }}>Status</span><br /><b style={{ color: getAQIColor(spot.aqi), fontSize: '0.7rem' }}>{spot.category?.label}</b></div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </motion.div>

      {/* Hotspot list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
        {hotspots.sort((a,b) => b.aqi - a.aqi).slice(0, 6).map(s => (
          <motion.div key={s.name} className='glass' whileHover={{ scale: 1.02 }} style={{ padding: '0.85rem', borderLeft: `3px solid ${getAQIColor(s.aqi)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.name}</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: getAQIColor(s.aqi) }}>{s.aqi}</div>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(226,240,255,0.45)', marginTop: 2 }}>{s.category?.label}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(226,240,255,0.45)' }}>PM2.5: {s.pm25} µg/m³ • {s.temperature}°C</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
