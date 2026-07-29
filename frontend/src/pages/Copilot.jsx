import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copilotAPI } from '../api';
import useStore from '../store';
import { Send, Bot, User, Lightbulb } from 'lucide-react';

export default function Copilot() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "👋 Hello! I'm EcoBot, your AI environmental assistant. I can help you understand air quality, predict pollution levels, analyze environmental trends, and suggest sustainability actions. What would you like to know? 🌍" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [context, setContext] = useState(null);
  const messagesEndRef = useRef(null);
  const { selectedCity } = useStore();

  useEffect(() => {
    copilotAPI.getSuggestions().then(r => setSuggestions(r.data)).catch(() => {});
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text = input.trim()) => {
    if (!text) return;
    setMessages(m => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await copilotAPI.chat(text, selectedCity);
      setContext(res.data.context);
      setMessages(m => [...m, { role: 'ai', text: res.data.response }]);
    } catch (error) {
      setMessages(m => [...m, { role: 'ai', text: '⚠️ Backend connection failed. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1rem', height: 'calc(100vh - 120px)' }}>
      {/* Chat */}
      <div className='glass' style={{ display: 'flex', flexDirection: 'column', borderRadius: 20, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#16A34A,#0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} color='white' />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>EcoBot — AI Environmental Copilot</div>
            <div style={{ fontSize: '0.7rem', color: '#16A34A' }}>● Online • Monitoring {selectedCity}</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'ai' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#16A34A,#0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={14} color='white' />
                </div>
              )}
              <div style={{
                maxWidth: '75%', padding: '0.75rem 1rem', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? 'linear-gradient(135deg,#16A34A,#0EA5E9)' : 'rgba(255,255,255,0.07)',
                border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                fontSize: '0.85rem', lineHeight: 1.6, color: '#E2F0FF',
              }}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={14} color='rgba(226,240,255,0.8)' />
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#16A34A,#0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={14} color='white' />
              </div>
              <div style={{ display: 'flex', gap: 4, padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.07)', borderRadius: '18px 18px 18px 4px' }}>
                {[0,1,2].map(i => <motion.div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#0EA5E9' }} animate={{ y: [-3, 3, -3] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />)}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8 }}>
          <input className='eco-input' value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder='Ask about air quality, pollution, predictions...' />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            style={{ background: 'linear-gradient(135deg,#16A34A,#0EA5E9)', border: 'none', borderRadius: 12, padding: '0.7rem 1rem', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Context card */}
        {context && (
          <motion.div className='glass' initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0EA5E9' }}>📊 Live Context</div>
            {[['City', context.city], ['AQI', context.aqi], ['Status', context.aqi_label], ['Temperature', `${context.temperature}°C`], ['Health Score', `${context.health_score}/100`]].map(([k,v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                <span style={{ color: 'rgba(226,240,255,0.5)' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Suggestions */}
        <div className='glass' style={{ padding: '1rem', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', color: '#FACC15' }}>
            <Lightbulb size={14} /> Suggested Questions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.5rem 0.75rem', color: 'rgba(226,240,255,0.75)', cursor: 'pointer', textAlign: 'left', fontSize: '0.78rem', fontFamily: 'Poppins', lineHeight: 1.4, transition: 'all 0.2s' }}
                onMouseEnter={e => e.target.style.borderColor = '#0EA5E9'}
                onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
