import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const C = { bg: '#0A0A0A', panel: '#141414', border: '#202020', accent: '#FF4500', accentL: '#FF6B35', gold: '#FFD60A', text: '#F2EDE8', muted: '#777', font: "'Georgia','Times New Roman',serif" };

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchRestaurants(); }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await axios.get('/api/restaurants');
      setRestaurants(data);
    } catch { } finally { setLoading(false); }
  };

  const seed = async () => {
    try {
      await axios.post('/api/restaurants/seed/data');
      fetchRestaurants();
    } catch (e) { alert('Seed failed: ' + e.message); }
  };

  const cuisines = ['All', ...new Set(restaurants.map(r => r.cuisine))];
  const filtered = restaurants.filter(r =>
    (cuisine === 'All' || r.cuisine === cuisine) &&
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#160800,#0A0A0A)', padding: '60px 28px 50px', textAlign: 'center', borderBottom: '1px solid #1A1A1A', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 60%, rgba(255,69,0,0.10) 0%, transparent 55%), radial-gradient(circle at 80% 30%, rgba(255,214,10,0.06) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <p style={{ color: C.accent, fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', marginBottom: 12, fontFamily: C.font }}>MERN Stack — Online Food Ordering System</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 46, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 12 }}>Delicious Food,<br /><span style={{ color: C.gold }}>Your Way</span></h1>
          <p style={{ color: C.muted, fontSize: 16, marginBottom: 36, fontStyle: 'italic' }}>Order from the best restaurants — customise every item exactly how you like it</p>
          <div style={{ display: 'flex', gap: 10, background: 'rgba(255,255,255,0.04)', padding: 8, borderRadius: 34, border: '1px solid #2A2A2A', maxWidth: 480, margin: '0 auto' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search restaurants…" style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 15, padding: '8px 12px', fontFamily: C.font, outline: 'none' }} />
            <button style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 26, padding: '9px 22px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Search</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 28px' }}>
        {restaurants.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', marginBottom: 30 }}>
            <p style={{ color: C.muted, fontSize: 15, marginBottom: 16 }}>No restaurants loaded. Click to seed sample data.</p>
            <button onClick={seed} style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 20, padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: C.font }}>🌱 Load Sample Restaurants</button>
          </div>
        )}
        {restaurants.length > 0 && (
          <button onClick={seed} style={{ background: 'transparent', color: C.muted, border: '1px solid #2A2A2A', borderRadius: 14, padding: '7px 16px', cursor: 'pointer', fontSize: 12, fontFamily: C.font, marginBottom: 20 }}>🔄 Re-seed Data</button>
        )}

        {/* Feature banner */}
        <div style={{ background: 'linear-gradient(135deg,#1C0800,#261200)', border: `1.5px solid ${C.accent}`, borderRadius: 18, padding: '20px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: C.accent, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 7, fontFamily: C.font }}>✨ Per-Item Customisation</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Every item customised your way</h2>
            <p style={{ color: C.muted, fontSize: 13 }}>Click "Customise" on any menu item to see options specific to that dish — spice, size, add-ons, removals and more.</p>
          </div>
          <div style={{ fontSize: 44, flexShrink: 0, marginLeft: 20 }}>🎨</div>
        </div>

        {/* Cuisine filter */}
        <div style={{ display: 'flex', gap: 9, marginBottom: 24, flexWrap: 'wrap' }}>
          {cuisines.map(c => (
            <button key={c} onClick={() => setCuisine(c)} style={{ padding: '7px 18px', borderRadius: 20, border: `1.5px solid ${cuisine === c ? C.accent : '#2A2A2A'}`, background: cuisine === c ? C.accent + '22' : 'transparent', color: cuisine === c ? C.accentL : C.muted, cursor: 'pointer', fontFamily: C.font, fontWeight: cuisine === c ? 700 : 400, fontSize: 13, transition: 'all .18s' }}>{c}</button>
          ))}
        </div>

        {/* Restaurant grid */}
        {loading ? (
          <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Loading…</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {filtered.map((r, i) => (
              <div key={r._id} onClick={() => navigate(`/restaurant/${r._id}`)}
                style={{ background: '#141414', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', cursor: 'pointer', border: '1px solid #202020', transition: 'transform .2s', animationDelay: `${i * 0.06}s` }}>
                <div style={{ background: `linear-gradient(135deg,${r.color || C.accent}22,${r.color || C.accent}44)`, height: 144, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: 62 }}>{r.emoji}</span>
                  {r.tag && <span style={{ position: 'absolute', top: 10, right: 10, background: '#0A0A0A', color: C.gold, padding: '3px 9px', borderRadius: 14, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{r.tag}</span>}
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 700, color: C.text }}>{r.name}</h3>
                    <span style={{ background: (r.color || C.accent) + '22', color: r.color || C.accent, padding: '2px 8px', borderRadius: 9, fontSize: 11, fontWeight: 700 }}>{r.cuisine}</span>
                  </div>
                  <p style={{ color: C.muted, fontSize: 12, marginBottom: 9, fontStyle: 'italic' }}>{r.description}</p>
                  <span style={{ color: C.gold, fontSize: 12 }}>{'★'.repeat(Math.floor(r.rating || 4))}<span style={{ color: C.muted }}> {r.rating}</span></span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9, paddingTop: 9, borderTop: '1px solid #1E1E1E', fontSize: 12, color: C.muted }}>
                    <span>🕐 {r.deliveryTime}</span><span>Min ₹{r.minOrder}</span>
                  </div>
                  <button style={{ marginTop: 11, width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: C.font }}>View Menu →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
