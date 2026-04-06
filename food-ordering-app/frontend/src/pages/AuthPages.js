import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const C = { bg: '#0A0A0A', panel: '#141414', panelB: '#1C1C1C', border: '#252525', accent: '#FF4500', text: '#F2EDE8', muted: '#777', font: "'Georgia','Times New Roman',serif" };
const input = { width: '100%', padding: '12px 15px', background: '#1C1C1C', border: '1.5px solid #252525', borderRadius: 10, fontSize: 14, fontFamily: "'Georgia',serif", color: '#F2EDE8', outline: 'none', boxSizing: 'border-box' };
const label = { display: 'block', fontWeight: 700, marginBottom: 5, fontSize: 11, color: '#777', textTransform: 'uppercase', letterSpacing: 1 };

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: C.panel, borderRadius: 22, padding: '40px 36px', width: '100%', maxWidth: 390, border: '1px solid #252525' }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <span style={{ fontSize: 46 }}>🔐</span>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 900, color: C.text, marginTop: 10, marginBottom: 5 }}>Welcome Back!</h2>
          <p style={{ color: C.muted, fontStyle: 'italic', fontSize: 13 }}>Sign in to FoodExpress</p>
        </div>
        {error && <div style={{ background: '#E6394618', border: '1px solid #E6394644', borderRadius: 8, padding: '10px 14px', color: '#E63946', fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: 15 }}><label style={label}>Email</label><input name="email" type="email" value={form.email} onChange={handle} required placeholder="you@example.com" style={input} /></div>
          <div style={{ marginBottom: 22 }}><label style={label}>Password</label><input name="password" type="password" value={form.password} onChange={handle} required placeholder="Your password" style={input} /></div>
          <button type="submit" disabled={loading} style={{ width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 11, padding: 13, fontWeight: 700, cursor: 'pointer', fontSize: 15, fontFamily: C.font }}>{loading ? 'Signing in…' : 'Sign In'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 18, color: C.muted, fontSize: 12 }}>Don't have an account? <Link to="/register" style={{ color: C.accent, fontWeight: 700 }}>Sign up</Link></p>
      </div>
    </div>
  );
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await register(form.name, form.email, form.password, form.phone, form.address); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: C.panel, borderRadius: 22, padding: '40px 36px', width: '100%', maxWidth: 400, border: '1px solid #252525' }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <span style={{ fontSize: 46 }}>🎉</span>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 900, color: C.text, marginTop: 10, marginBottom: 5 }}>Create Account</h2>
          <p style={{ color: C.muted, fontStyle: 'italic', fontSize: 13 }}>Join thousands of food lovers</p>
        </div>
        {error && <div style={{ background: '#E6394618', border: '1px solid #E6394644', borderRadius: 8, padding: '10px 14px', color: '#E63946', fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <form onSubmit={submit}>
          {[['name', 'Full Name', 'text', 'John Doe'], ['email', 'Email', 'email', 'you@example.com'], ['password', 'Password', 'password', 'At least 6 characters'], ['phone', 'Phone (optional)', 'tel', '+91 98765 43210']].map(([n, l, t, ph]) => (
            <div key={n} style={{ marginBottom: 14 }}><label style={label}>{l}</label><input name={n} type={t} value={form[n]} onChange={handle} required={n !== 'phone'} placeholder={ph} style={input} /></div>
          ))}
          <div style={{ marginBottom: 22 }}><label style={label}>Delivery Address</label><textarea name="address" value={form.address} onChange={handle} rows={2} placeholder="Your address…" style={{ ...input, resize: 'vertical' }} /></div>
          <button type="submit" disabled={loading} style={{ width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 11, padding: 13, fontWeight: 700, cursor: 'pointer', fontSize: 15, fontFamily: C.font }}>{loading ? 'Creating…' : 'Create Account'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 18, color: C.muted, fontSize: 12 }}>Already have an account? <Link to="/login" style={{ color: C.accent, fontWeight: 700 }}>Sign in</Link></p>
      </div>
    </div>
  );
}

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: user?.address || '' });
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  if (!user) { navigate('/login'); return null; }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '38px 20px', color: C.text }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ background: C.panel, borderRadius: 22, padding: 30, textAlign: 'center', marginBottom: 20, border: '1px solid #252525' }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: C.accent, color: '#fff', fontSize: 32, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>{user.name[0].toUpperCase()}</div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 700 }}>{user.name}</h2>
          <p style={{ color: C.muted, fontSize: 14 }}>{user.email}</p>
        </div>
        <div style={{ background: C.panel, borderRadius: 22, padding: 28, border: '1px solid #252525' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Edit Profile</h3>
          {[['name', 'Full Name', 'text'], ['phone', 'Phone', 'tel']].map(([n, l, t]) => (
            <div key={n} style={{ marginBottom: 14 }}><label style={label}>{l}</label><input name={n} type={t} value={form[n]} onChange={handle} style={input} /></div>
          ))}
          <div style={{ marginBottom: 22 }}><label style={label}>Delivery Address</label><textarea name="address" value={form.address} onChange={handle} rows={3} style={{ ...input, resize: 'vertical' }} /></div>
          <button onClick={() => alert('Profile saved!')} style={{ width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 11, padding: 13, fontWeight: 700, cursor: 'pointer', fontSize: 15, fontFamily: C.font, marginBottom: 10 }}>Save Changes</button>
          <button onClick={() => { logout(); navigate('/'); }} style={{ width: '100%', background: 'transparent', color: C.muted, border: '1px solid #2A2A2A', borderRadius: 11, padding: 11, cursor: 'pointer', fontSize: 14, fontFamily: C.font }}>Logout</button>
        </div>
      </div>
    </div>
  );
}
