import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const C = { bg: '#0A0A0A', panel: '#141414', panelB: '#1C1C1C', border: '#202020', accent: '#FF4500', accentL: '#FF6B35', gold: '#FFD60A', text: '#F2EDE8', muted: '#777', green: '#00E676', font: "'Georgia','Times New Roman',serif" };
const STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
const STATUS_COLORS = { Pending: '#FFB703', Confirmed: '#4CC9F0', Preparing: '#F77F00', 'Out for Delivery': '#7B2D8B', Delivered: '#00E676' };

function OrderCard({ order, isCustom }) {
  const [expanded, setExpanded] = useState(false);
  const statusIdx = STATUSES.indexOf(order.status);
  const statusColor = STATUS_COLORS[order.status] || C.muted;

  // Build customization chips for one item
  const buildChips = (item) => {
    const chips = [];
    const f = (val, color) => val && chips.push({ label: val, color });
    f(item.spiceLevel, '#F4A261');
    f(item.gravyChoice, '#4CC9F0');
    f(item.portionChoice, '#4CC9F0');
    f(item.marinationChoice, '#7B2D8B');
    f(item.cookStyleChoice, '#888');
    f(item.proteinChoice, '#F77F00');
    f(item.bunChoice, '#888');
    f(item.pattyChoice, '#888');
    f(item.donenessChoice, '#E63946');
    f(item.crustChoice, '#888');
    f(item.sizeChoice, '#888');
    f(item.sauceChoice, '#FF6B35');
    f(item.frySizeChoice, '#888');
    f(item.seasoningChoice, '#888');
    f(item.pastaTypeChoice, '#888');
    f(item.sweetnessChoice, '#4CC9F0');
    item.selectedAddOns?.forEach(ao => chips.push({ label: `+ ${ao.name}`, color: C.accentL }));
    item.removedIngredients?.forEach(r => chips.push({ label: `✕ ${r}`, color: '#E63946' }));
    return chips;
  };

  return (
    <div style={{ background: C.panel, borderRadius: 18, padding: 22, border: '1px solid #1E1E1E', marginBottom: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 13 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 700, color: C.text }}>{order.restaurantName}</h3>
            {isCustom && <span style={{ background: C.gold + '20', color: C.gold, padding: '2px 8px', borderRadius: 9, fontSize: 10, fontWeight: 700 }}>CUSTOMISED</span>}
          </div>
          <p style={{ color: C.muted, fontSize: 11 }}>#{order._id?.slice(-8).toUpperCase() || order.id} · {new Date(order.createdAt || order.date).toLocaleString()}</p>
        </div>
        <span style={{ padding: '5px 13px', borderRadius: 16, fontSize: 12, fontWeight: 700, background: statusColor + '28', color: statusColor, border: `1px solid ${statusColor}40` }}>{order.status}</span>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        {STATUSES.slice(0, 5).map((s, idx) => (
          <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: statusIdx >= idx ? C.accent : '#252525', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700, transition: 'background .3s' }}>
              {statusIdx > idx ? '✓' : idx + 1}
            </div>
            <span style={{ fontSize: 8, color: statusIdx >= idx ? C.accent : C.muted, textAlign: 'center', maxWidth: 50 }}>{s}</span>
          </div>
        ))}
      </div>

      {/* Items */}
      <div style={{ borderTop: '1px solid #1E1E1E', paddingTop: 11 }}>
        {(isCustom ? order.items : order.items)?.slice(0, expanded ? 999 : 3).map((item, i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #1A1A1A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: C.text }}>{item.emoji} {isCustom ? item.menuItemName : item.name} ×{item.quantity}</span>
              <span style={{ color: C.muted }}>₹{(isCustom ? item.finalPrice : item.price) * item.quantity}</span>
            </div>
            {isCustom && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
                {buildChips(item).map((ch, ci) => (
                  <span key={ci} style={{ background: ch.color + '18', color: ch.color, border: `1px solid ${ch.color}30`, padding: '2px 7px', borderRadius: 9, fontSize: 10 }}>{ch.label}</span>
                ))}
                {item.specialInstructions && <span style={{ color: C.muted, fontSize: 10, fontStyle: 'italic' }}>"{item.specialInstructions}"</span>}
              </div>
            )}
          </div>
        ))}
        {(order.items?.length > 3) && (
          <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: C.accent, cursor: 'pointer', fontSize: 12, padding: '6px 0', fontFamily: C.font }}>
            {expanded ? '▲ Show less' : `▼ Show all ${order.items.length} items`}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 11, paddingTop: 11, borderTop: '1px solid #1E1E1E' }}>
        <p style={{ color: C.muted, fontSize: 11 }}>💳 {order.paymentMethod}</p>
        <span style={{ fontFamily: 'Georgia,serif', fontSize: 19, fontWeight: 700, color: C.accent }}>₹{order.totalAmount}</span>
      </div>
    </div>
  );
}

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    Promise.all([
      axios.get('/api/orders/myorders').then(r => r.data),
      axios.get('/api/custom-orders/myorders').then(r => r.data),
    ]).then(([o, co]) => {
      setOrders(o);
      setCustomOrders(co);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const allOrders = [
    ...orders.map(o => ({ ...o, isCustom: false })),
    ...customOrders.map(o => ({ ...o, isCustom: true })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const displayed = tab === 'all' ? allOrders : tab === 'custom' ? allOrders.filter(o => o.isCustom) : allOrders.filter(o => !o.isCustom);

  if (loading) return <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>Loading orders…</div>;

  if (!allOrders.length) return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: C.text }}>
      <div>
        <div style={{ fontSize: 68 }}>📋</div>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, margin: '16px 0 9px' }}>No Orders Yet</h2>
        <p style={{ color: C.muted, marginBottom: 26 }}>Start ordering your favourite food!</p>
        <button onClick={() => navigate('/')} style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 20, padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: C.font }}>Browse Restaurants</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 28px' }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 900, marginBottom: 20 }}>My Orders 📋</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 9, marginBottom: 22 }}>
          {[['all', `All (${allOrders.length})`], ['custom', `Customised (${allOrders.filter(o => o.isCustom).length})`], ['regular', `Regular (${allOrders.filter(o => !o.isCustom).length})`]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{ padding: '7px 18px', borderRadius: 20, border: `1.5px solid ${tab === key ? C.accent : '#2A2A2A'}`, background: tab === key ? C.accent + '22' : 'transparent', color: tab === key ? C.accentL : C.muted, cursor: 'pointer', fontFamily: C.font, fontWeight: tab === key ? 700 : 400, fontSize: 13 }}>{label}</button>
          ))}
        </div>

        {displayed.map(order => (
          <OrderCard key={order._id || order.id} order={order} isCustom={order.isCustom} />
        ))}
      </div>
    </div>
  );
}
