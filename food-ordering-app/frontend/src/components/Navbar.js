import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const S = {
  nav: { background: '#0D0D0D', borderBottom: '2px solid #FF4500', padding: '0 28px', position: 'sticky', top: 0, zIndex: 100 },
  inner: { maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', cursor: 'pointer' },
  logoText: { fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 900, color: '#fff' },
  links: { display: 'flex', alignItems: 'center', gap: 16 },
  link: { color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, fontFamily: 'Georgia, serif', fontWeight: 600, transition: 'color .2s' },
  cartBtn: { position: 'relative', background: 'rgba(255,255,255,0.06)', border: '1px solid #2A2A2A', borderRadius: 18, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 7, color: '#fff', fontSize: 14, cursor: 'pointer', textDecoration: 'none' },
  badge: { background: '#FF4500', color: '#fff', borderRadius: '50%', width: 19, height: 19, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 },
  avatar: { width: 33, height: 33, borderRadius: '50%', background: '#FF4500', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, cursor: 'pointer', fontSize: 14, textDecoration: 'none' },
  logoutBtn: { color: '#666', cursor: 'pointer', fontSize: 12, fontFamily: 'Georgia, serif', background: 'none', border: 'none' },
  signIn: { background: '#FF4500', color: '#fff', padding: '7px 16px', borderRadius: 16, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'Georgia, serif', textDecoration: 'none' },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <nav style={S.nav}>
      <div style={S.inner}>
        <Link to="/" style={S.logo}>
          <span style={{ fontSize: 24 }}>🍽️</span>
          <span style={S.logoText}>Food<span style={{ color: '#FFD60A' }}>Express</span></span>
        </Link>
        <div style={S.links}>
          <Link to="/" style={S.link}>Restaurants</Link>
          {user && <Link to="/orders" style={S.link}>My Orders</Link>}
          <Link to="/cart" style={S.cartBtn}>
            🛒 Cart
            {cartCount > 0 && <span style={S.badge}>{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/profile" style={S.avatar}>{user.name[0].toUpperCase()}</Link>
              <button onClick={() => { logout(); navigate('/'); }} style={S.logoutBtn}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={S.signIn}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
