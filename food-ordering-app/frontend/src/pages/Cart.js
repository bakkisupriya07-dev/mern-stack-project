import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const C = { bg: '#0A0A0A', panel: '#141414', panelB: '#1C1C1C', border: '#202020', accent: '#FF4500', accentL: '#FF6B35', gold: '#FFD60A', text: '#F2EDE8', muted: '#777', green: '#00E676', font: "'Georgia','Times New Roman',serif" };

function CustomSummaryChips({ config }) {
  if (!config) return null;
  const chips = [];
  if (config.spiceLevel)         chips.push({ label: config.spiceLevel, color: '#F4A261' });
  if (config.gravyChoice)        chips.push({ label: config.gravyChoice, color: '#4CC9F0' });
  if (config.portionChoice)      chips.push({ label: config.portionChoice, color: '#4CC9F0' });
  if (config.marinationChoice)   chips.push({ label: config.marinationChoice, color: '#7B2D8B' });
  if (config.cookStyleChoice)    chips.push({ label: config.cookStyleChoice, color: '#888' });
  if (config.proteinChoice)      chips.push({ label: config.proteinChoice, color: '#F77F00' });
  if (config.bunChoice)          chips.push({ label: config.bunChoice, color: '#888' });
  if (config.pattyChoice)        chips.push({ label: config.pattyChoice, color: '#888' });
  if (config.donenessChoice)     chips.push({ label: config.donenessChoice, color: '#E63946' });
  if (config.crustChoice)        chips.push({ label: config.crustChoice, color: '#888' });
  if (config.sizeChoice)         chips.push({ label: config.sizeChoice, color: '#888' });
  if (config.sauceChoice)        chips.push({ label: config.sauceChoice, color: '#FF6B35' });
  if (config.frySizeChoice)      chips.push({ label: config.frySizeChoice, color: '#888' });
  if (config.seasoningChoice)    chips.push({ label: config.seasoningChoice, color: '#888' });
  if (config.pastaTypeChoice)    chips.push({ label: config.pastaTypeChoice, color: '#888' });
  if (config.sweetnessChoice)    chips.push({ label: config.sweetnessChoice, color: '#4CC9F0' });
  if (config.temperatureChoice)  chips.push({ label: config.temperatureChoice, color: '#4CC9F0' });
  config.selectedAddOns?.forEach(ao => chips.push({ label: `+ ${ao.name}`, color: C.accentL }));
  config.removedIngredients?.forEach(r => chips.push({ label: `✕ ${r}`, color: '#E63946' }));

  if (chips.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
      {chips.map((ch, i) => (
        <span key={i} style={{ background: ch.color + '18', color: ch.color, border: `1px solid ${ch.color}33`, padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{ch.label}</span>
      ))}
      {config.specialInstructions && (
        <span style={{ color: C.muted, fontSize: 10, fontStyle: 'italic', alignSelf: 'center' }}>"{config.specialInstructions}"</span>
      )}
    </div>
  );
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [payment, setPayment] = useState('Cash on Delivery');
  const [placing, setPlacing] = useState(false);

  const delivery = 40;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + delivery + tax;

  const placeOrder = async () => {
    if (!user) { navigate('/login'); return; }
    if (!address.trim()) { alert('Please enter delivery address'); return; }
    if (!cart.length) return;
    setPlacing(true);
    try {
      const restaurantId   = cart[0].restaurantId;
      const restaurantName = cart[0].restaurantName;

      // Separate customized vs plain items
      const hasCustomized = cart.some(c => c.isCustomized);

      if (hasCustomized) {
        // Place as custom order
        const items = cart.map(ci => ({
          menuItemId:   ci.menuItemId,
          menuItemName: ci.name,
          emoji:        ci.emoji,
          basePrice:    ci.price,
          finalPrice:   ci.finalPrice,
          quantity:     ci.quantity,
          spiceLevel:          ci.customization?.spiceLevel || '',
          gravyChoice:         ci.customization?.gravyChoice || '',
          portionChoice:       ci.customization?.portionChoice || '',
          marinationChoice:    ci.customization?.marinationChoice || '',
          cookStyleChoice:     ci.customization?.cookStyleChoice || '',
          proteinChoice:       ci.customization?.proteinChoice || '',
          breadTypeChoice:     ci.customization?.breadTypeChoice || '',
          countChoice:         ci.customization?.countChoice || '',
          bunChoice:           ci.customization?.bunChoice || '',
          pattyChoice:         ci.customization?.pattyChoice || '',
          donenessChoice:      ci.customization?.donenessChoice || '',
          crustChoice:         ci.customization?.crustChoice || '',
          sizeChoice:          ci.customization?.sizeChoice || '',
          sauceChoice:         ci.customization?.sauceChoice || '',
          frySizeChoice:       ci.customization?.frySizeChoice || '',
          seasoningChoice:     ci.customization?.seasoningChoice || '',
          temperatureChoice:   ci.customization?.temperatureChoice || '',
          sweetnessChoice:     ci.customization?.sweetnessChoice || '',
          pastaTypeChoice:     ci.customization?.pastaTypeChoice || '',
          selectedAddOns:      ci.customization?.selectedAddOns || [],
          removedIngredients:  ci.customization?.removedIngredients || [],
          specialInstructions: ci.customization?.specialInstructions || '',
        }));
        await axios.post('/api/custom-orders', { restaurantId, restaurantName, items, totalAmount: total, deliveryAddress: address, paymentMethod: payment });
      } else {
        const items = cart.map(ci => ({ menuItemId: ci.menuItemId, name: ci.name, emoji: ci.emoji, price: ci.finalPrice, quantity: ci.quantity }));
        await axios.post('/api/orders', { restaurantId, restaurantName, items, totalAmount: total, deliveryAddress: address, paymentMethod: payment });
      }

      clearCart();
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.length) return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: C.text }}>
      <div>
        <div style={{ fontSize: 70 }}>🛒</div>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, margin: '16px 0 9px' }}>Cart is Empty</h2>
        <p style={{ color: C.muted, marginBottom: 26 }}>Add items from a restaurant to get started</p>
        <button onClick={() => navigate('/')} style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 20, padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: C.font }}>Browse Restaurants</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '32px 28px' }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Your Cart 🛒</h1>
        <p style={{ color: C.muted, marginBottom: 24, fontStyle: 'italic' }}>From {cart[0]?.restaurantName}</p>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cart.map(item => (
              <div key={item.cartId} style={{ background: C.panel, borderRadius: 14, padding: 16, border: '1px solid #202020' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 30, flexShrink: 0 }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 15, color: C.text }}>{item.name}</span>
                      {item.isCustomized && <span style={{ background: C.gold + '22', color: C.gold, border: `1px solid ${C.gold}44`, padding: '2px 7px', borderRadius: 9, fontSize: 10, fontWeight: 700 }}>CUSTOMISED</span>}
                    </div>
                    {item.isCustomized && <CustomSummaryChips config={item.customization} />}
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>
                      ₹{item.finalPrice} each
                      {item.finalPrice !== item.price && <span style={{ color: C.accentL, marginLeft: 6 }}>+₹{item.finalPrice - item.price} customisation</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #333', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 900 }}>−</button>
                    <span style={{ fontWeight: 700, color: C.text, minWidth: 18, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: '50%', background: C.accent, border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 900 }}>+</button>
                  </div>
                  <span style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 16, minWidth: 64, textAlign: 'right', color: C.text }}>₹{item.finalPrice * item.quantity}</span>
                  <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: C.muted }}>🗑️</button>
                </div>
              </div>
            ))}

            {/* Delivery address */}
            <div style={{ background: C.panel, borderRadius: 14, padding: 18, border: '1px solid #202020' }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 11 }}>📍 Delivery Address</h3>
              <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} placeholder="Enter your full delivery address…"
                style={{ width: '100%', padding: '11px 13px', background: C.panelB, border: '1.5px solid #252525', borderRadius: 10, fontSize: 14, fontFamily: C.font, resize: 'vertical', color: C.text, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* Payment */}
            <div style={{ background: C.panel, borderRadius: 14, padding: 18, border: '1px solid #202020' }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 11 }}>💳 Payment</h3>
              <div style={{ display: 'flex', gap: 12 }}>
                {['Cash on Delivery', 'Online Payment'].map(pm => (
                  <label key={pm} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flex: 1, background: payment === pm ? C.accent + '12' : C.panelB, border: `1.5px solid ${payment === pm ? C.accent : '#2A2A2A'}`, borderRadius: 10, padding: '11px 13px', transition: 'all .2s' }}>
                    <input type="radio" checked={payment === pm} onChange={() => setPayment(pm)} style={{ accentColor: C.accent }} />
                    <span style={{ color: C.text, fontSize: 13, fontWeight: payment === pm ? 700 : 400 }}>{pm}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div style={{ width: 245, background: C.panel, borderRadius: 15, padding: 20, border: '1px solid #202020', position: 'sticky', top: 82 }}>
            <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>Order Summary</h3>
            {[['Subtotal', cartTotal], ['Delivery', delivery], ['Tax (5%)', tax]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1E1E1E', fontSize: 13, color: C.muted }}><span>{l}</span><span>₹{v}</span></div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', fontWeight: 700, fontSize: 19, color: C.text, fontFamily: 'Georgia,serif' }}><span>Total</span><span style={{ color: C.accent }}>₹{total}</span></div>
            <button onClick={placeOrder} disabled={placing} style={{ width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 11, padding: 13, fontWeight: 700, cursor: 'pointer', fontSize: 15, fontFamily: C.font, marginBottom: 9 }}>
              {placing ? 'Placing…' : '🎉 Place Order'}
            </button>
            <button onClick={() => navigate('/')} style={{ width: '100%', background: 'none', border: '1px solid #2A2A2A', borderRadius: 11, padding: 10, cursor: 'pointer', fontSize: 13, fontFamily: C.font, color: C.muted }}>+ Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );
}
