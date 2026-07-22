import { useState } from 'react';
import { motion } from 'motion/react';

interface AuthPageProps {
  onLogin: (email: string, password: string, role: 'user' | 'admin') => void;
  mode: 'login' | 'register';
  setMode: (m: 'login' | 'register') => void;
}

function LeafDecor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 100" fill="none">
      <path d="M40 90 C40 90 8 68 8 38 C8 14 40 6 40 6 C40 6 72 14 72 38 C72 68 40 90 40 90 Z"
        stroke="#8FAF8F" strokeWidth="1.5" fill="rgba(143,175,143,0.12)" />
      <line x1="40" y1="90" x2="40" y2="6" stroke="#8FAF8F" strokeWidth="1" strokeDasharray="4 3" />
      <path d="M40 50 C28 46 20 40 18 34" stroke="#8FAF8F" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M40 62 C52 58 60 52 62 46" stroke="#8FAF8F" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

function SeedlingDecor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 80" fill="none">
      <line x1="30" y1="75" x2="30" y2="30" stroke="#6B8F6B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 45 C24 38 14 36 12 40 C16 46 26 46 30 45 Z" fill="rgba(107,143,107,0.2)" stroke="#6B8F6B" strokeWidth="1" />
      <path d="M30 45 C36 38 46 36 48 40 C44 46 34 46 30 45 Z" fill="rgba(107,143,107,0.2)" stroke="#6B8F6B" strokeWidth="1" />
      <ellipse cx="30" cy="76" rx="14" ry="4" fill="rgba(107,79,53,0.25)" />
    </svg>
  );
}

export function AuthPage({ onLogin, mode, setMode }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'register' && !name) { setError('Please enter your name.'); return; }
    setError('');
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
    onLogin(email, password, role);
  };

  const quickLogin = (r: 'user' | 'admin') => {
    const e = r === 'admin' ? 'admin@grove.edu' : 'maya@grove.edu';
    onLogin(e, 'demo', r);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '12px',
    border: '1.5px solid rgba(107,143,107,0.3)', background: '#EFF7F0',
    color: '#2D5016', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#F7F4EE' }}>
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute -top-20 -left-20 w-80 h-80 opacity-20" viewBox="0 0 300 300">
          <path d="M150,30 Q220,10 260,80 Q300,150 250,220 Q200,290 120,270 Q40,250 20,170 Q0,90 60,40 Q90,20 150,30 Z" fill="#6B8F6B" />
        </svg>
        <svg className="absolute -bottom-20 -right-20 w-96 h-96 opacity-15" viewBox="0 0 300 300">
          <path d="M180,20 Q260,30 280,110 Q300,190 230,250 Q160,310 80,280 Q0,250 10,160 Q20,70 100,30 Q140,10 180,20 Z" fill="#C8714A" />
        </svg>
        <LeafDecor className="absolute top-10 right-20 w-16 h-20 opacity-40" />
        <SeedlingDecor className="absolute bottom-20 left-16 w-12 h-16 opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="#2D5016" />
              <path d="M16 26 C16 26 8 20 8 13 C8 8 16 6 16 6 C16 6 24 8 24 13 C24 20 16 26 16 26 Z" fill="#8FAF8F" />
              <line x1="16" y1="26" x2="16" y2="6" stroke="#D4EDD8" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
            <h1 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#2D5016', margin: 0 }}>
              Grove LMS
            </h1>
          </div>
          <p style={{ color: '#6B8F6B', fontSize: '0.875rem' }}>Your calm space to learn and grow</p>
        </div>

        <div className="rounded-2xl p-7 shadow-sm" style={{ background: '#EAF4EF', border: '1px solid rgba(107,143,107,0.2)' }}>
          {/* Tab switcher */}
          <div className="flex rounded-full p-1 mb-6" style={{ background: 'rgba(107,143,107,0.12)' }}>
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1, padding: '7px 0', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                  fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  background: mode === m ? '#2D5016' : 'transparent',
                  color: mode === m ? '#F7F4EE' : '#6B8F6B',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#2D5016', marginBottom: '5px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  style={inputStyle}
                />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#2D5016', marginBottom: '5px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@grove.edu"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#2D5016', marginBottom: '5px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            {error && (
              <p style={{ fontSize: '0.8rem', color: '#C8714A', fontWeight: 500 }}>{error}</p>
            )}

            <button
              type="submit"
              style={{
                width: '100%', padding: '11px', borderRadius: '9999px', border: 'none',
                background: '#2D5016', color: '#F7F4EE', cursor: 'pointer',
                fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.95rem',
                marginTop: '4px', transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#3D6132')}
              onMouseLeave={e => (e.currentTarget.style.background = '#2D5016')}
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5">
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#8FAF8F', marginBottom: '10px', fontWeight: 500 }}>
              — Quick demo access —
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => quickLogin('user')}
                style={{
                  flex: 1, padding: '8px', borderRadius: '9999px', cursor: 'pointer',
                  border: '1.5px solid rgba(107,143,107,0.4)', background: 'transparent',
                  fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem',
                  color: '#4A6741', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#D4EDD8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Student View
              </button>
              <button
                onClick={() => quickLogin('admin')}
                style={{
                  flex: 1, padding: '8px', borderRadius: '9999px', cursor: 'pointer',
                  border: '1.5px solid rgba(200,113,74,0.4)', background: 'transparent',
                  fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem',
                  color: '#C8714A', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FDF0DC'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Instructor View
              </button>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#8FAF8F', marginTop: '20px' }}>
          Tip: emails containing "admin" log in as instructor
        </p>
      </motion.div>
    </div>
  );
}
