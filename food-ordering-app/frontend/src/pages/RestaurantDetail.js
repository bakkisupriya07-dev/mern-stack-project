import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ItemCustomizeModal from '../components/ItemCustomizeModal';

const C = { bg: '#0A0A0A', panel: '#141414', panelB: '#1C1C1C', border: '#202020', accent: '#FF4500', accentL: '#FF6B35', gold: '#FFD60A', text: '#F2EDE8', muted: '#777', font: "'Georgia','Times New Roman',serif" };

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, addToCart } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [customizeItem, setCustomizeItem] = useState(null); // item being customised

  useEffect(() => {
    axios.get(`/api/restaurants/${id}`)
      .then(({ data }) => setRestaurant(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>Loading menu…</div>;
  if (!restaurant) return null;

  const categories = ['All', ...new Set(restaurant.menu.map(m => m.category))];
  const filteredMenu = activeCategory === 'All' ? restaurant.menu : restaurant.menu.filter(m => m.category === activeCategory);

  const getCartCount = (itemId) => cart.filter(c => c.menuItemId === itemId).reduce((s, c) => s + c.quantity, 0);

  const handleQuickAdd = (item) => {
    if (!user) { navigate('/login'); return; }
    addToCart({ menuItemId: item._id, name: item.name, emoji: item.emoji, price: item.price, finalPrice: item.price, quantity: 1, isCustomized: false, restaurantId: restaurant._id, restaurantName: restaurant.name });
  };

  const handleCustomize = (item) => {
    if (!user) { navigate('/login'); return; }
    setCustomizeItem(item);
  };

  const handleAddCustomized = (cartItem) => {
    addToCart({ ...cartItem, restaurantId: restaurant._id, restaurantName: restaurant.name });
  };

  const cartHere = cart.filter(c => c.restaurantId === restaurant._id);
  const cartSubtotal = cartHere.reduce((s, c) => s + c.finalPrice * c.quantity, 0);

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* Restaurant banner */}
      <div style={{ background: `linear-gradient(135deg,${restaurant.color || C.accent}18,${restaurant.color || C.accent}36)`, padding: '44px 28px', textAlign: 'center', borderBottom: `2px solid ${restaurant.color || C.accent}33` }}>
        <div style={{ fontSize: 70, marginBottom: 10 }}>{restaurant.emoji}</div>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 32, fontWeight: 900, color: C.text, marginBottom: 6 }}>{restaurant.name}</h1>
        <p style={{ color: C.muted, fontSize: 14, fontStyle: 'italic', marginBottom: 14 }}>{restaurant.description}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {[['⭐', restaurant.rating], ['🕐', restaurant.deliveryTime], ['🍽️', restaurant.cuisine], ['Min ₹', restaurant.minOrder]].map(([ic, v]) => (
            <span key={`${ic}${v}`} style={{ background: 'rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 600, color: C.text, border: '1px solid #2A2A2A' }}>{ic} {v}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '24px 28px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Menu */}
        <div style={{ flex: 1 }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ padding: '7px 16px', borderRadius: 18, border: `1.5px solid ${activeCategory === cat ? (restaurant.color || C.accent) : '#2A2A2A'}`, background: activeCategory === cat ? (restaurant.color || C.accent) + '22' : 'transparent', color: activeCategory === cat ? (restaurant.color || C.accent) : C.muted, cursor: 'pointer', fontFamily: C.font, fontWeight: activeCategory === cat ? 700 : 400, fontSize: 13, transition: 'all .18s' }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Menu items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredMenu.map(item => {
              const qtyInCart = getCartCount(item._id);
              const hasCustomization = item.customization && Object.values(item.customization).some(v => Array.isArray(v) ? v.length > 0 : false);
              const customOptionCount = item.customization
                ? Object.values(item.customization).filter(v => Array.isArray(v) && v.length > 0).length
                : 0;

              return (
                <div key={item._id} style={{ background: C.panel, borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start', border: '1px solid #202020' }}>
                  {/* Icon */}
                  <div style={{ width: 64, height: 64, borderRadius: 12, background: (restaurant.color || C.accent) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>{item.emoji}</div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <div style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 700, color: C.text }}>{item.name}</div>
                      {item.isVeg && <span style={{ width: 16, height: 16, border: '2px solid #00E676', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E676', display: 'block' }} /></span>}
                    </div>
                    <p style={{ color: C.muted, fontSize: 12, fontStyle: 'italic', margin: '0 0 6px' }}>{item.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 700, color: C.accent }}>₹{item.price}</span>
                      {hasCustomization && (
                        <span style={{ background: C.gold + '22', color: C.gold, border: `1px solid ${C.gold}44`, padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>
                          {customOptionCount} custom option{customOptionCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    {hasCustomization && (
                      <button onClick={() => handleCustomize(item)}
                        style={{ padding: '6px 14px', borderRadius: 16, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 12, fontFamily: C.font, whiteSpace: 'nowrap', transition: 'all .15s' }}>
                        ✎ Customise
                      </button>
                    )}
                    {qtyInCart > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.panelB, borderRadius: 18, padding: '3px 8px', border: '1px solid #252525' }}>
                        <button onClick={() => {
                          const last = cart.filter(c => c.menuItemId === item._id).pop();
                          if (last) { /* handled via CartContext */ }
                        }}
                          style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #333', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ fontWeight: 700, color: C.text, minWidth: 18, textAlign: 'center' }}>{qtyInCart}</span>
                        <button onClick={() => handleQuickAdd(item)}
                          style={{ width: 26, height: 26, borderRadius: '50%', background: C.accent, border: 'none', color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                    ) : (
                      <button onClick={() => handleQuickAdd(item)}
                        style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 16, padding: '8px 17px', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: C.font }}>
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart mini-panel */}
        {cartHere.length > 0 && (
          <div style={{ width: 245, flexShrink: 0 }}>
            <div style={{ background: C.panel, borderRadius: 16, padding: 18, border: '1px solid #222', position: 'sticky', top: 82 }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 13 }}>Your Cart 🛒</h3>
              {cartHere.map(ci => (
                <div key={ci.cartId} style={{ padding: '7px 0', borderBottom: '1px solid #1E1E1E', fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: C.muted }}>
                    <span>{ci.emoji} {ci.name} ×{ci.quantity}</span>
                    <span style={{ color: C.text, fontWeight: 700 }}>₹{ci.finalPrice * ci.quantity}</span>
                  </div>
                  {ci.isCustomized && (
                    <div style={{ color: C.gold, fontSize: 10, marginTop: 3 }}>✨ Customised</div>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700, fontSize: 16, color: C.text, fontFamily: 'Georgia,serif' }}>
                <span>Total</span>
                <span style={{ color: C.accent }}>₹{cartSubtotal}</span>
              </div>
              <button onClick={() => navigate('/cart')} style={{ width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 10, padding: 11, fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: C.font }}>Checkout →</button>
            </div>
          </div>
        )}
      </div>

      {/* Customise modal */}
      {customizeItem && (
        <ItemCustomizeModal
          item={customizeItem}
          onClose={() => setCustomizeItem(null)}
          onAddToCart={handleAddCustomized}
        />
      )}
    </div>
  );
}
