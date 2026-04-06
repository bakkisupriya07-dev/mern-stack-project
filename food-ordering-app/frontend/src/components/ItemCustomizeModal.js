import React, { useState, useEffect } from 'react';

const C = {
  bg: '#0D0D0D', panel: '#161616', panelB: '#1E1E1E', border: '#2A2A2A',
  accent: '#FF4500', accentL: '#FF6B35', gold: '#FFD60A',
  text: '#F0EAE0', muted: '#777', green: '#00E676',
  font: "'Georgia', 'Times New Roman', serif",
};

/* Parse "+₹N" upcharge from an option string */
const parseUpcharge = (str) => {
  const m = str?.match(/\+₹(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
};

/* Render a horizontal chip selector (single choice) */
function ChipSelect({ label, options, value, onChange }) {
  if (!options?.length) return null;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, color: C.muted, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            style={{
              padding: '7px 15px', borderRadius: 20, fontFamily: C.font, fontSize: 13, cursor: 'pointer',
              border: `1.5px solid ${value === opt ? C.accent : C.border}`,
              background: value === opt ? C.accent + '22' : 'transparent',
              color: value === opt ? C.accentL : C.muted,
              fontWeight: value === opt ? 700 : 400, transition: 'all .15s',
            }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Spice level with colour coding */
function SpiceSelector({ options, value, onChange }) {
  if (!options?.length) return null;
  const COLORS = { 'No Spice': '#4CC9F0', 'Mild': '#4CC9F0', 'Medium': '#F4A261', 'Medium Spicy': '#F4A261', 'Spicy': '#E63946', 'Extra Spicy': '#9D0208', 'Nashville Hot': '#9D0208', 'Original': '#4CC9F0', 'Very Spicy': '#9D0208' };
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, color: C.muted, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Spice level</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {options.map(opt => {
          const col = COLORS[opt] || '#F4A261';
          const isSel = value === opt;
          return (
            <button key={opt} onClick={() => onChange(opt)}
              style={{
                flex: 1, padding: '10px 6px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                border: `1.5px solid ${isSel ? col : C.border}`,
                background: isSel ? col + '22' : C.panelB,
                transition: 'all .15s',
              }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>
                {opt === 'No Spice' ? '😌' : opt === 'Mild' || opt === 'Original' ? '😊' : opt === 'Medium' || opt === 'Medium Spicy' ? '😋' : opt === 'Spicy' ? '🌶️' : '🔥'}
              </div>
              <div style={{ fontSize: 11, color: isSel ? col : C.muted, fontWeight: isSel ? 700 : 400 }}>{opt}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Paid add-ons — multi-select toggle */
function AddOnSelector({ label, options, selected, onToggle }) {
  if (!options?.length) return null;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, color: C.muted, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map(opt => {
          const isSel = selected.some(s => s.name === opt.name);
          return (
            <div key={opt.name} onClick={() => onToggle(opt)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
                border: `1.5px solid ${isSel ? C.accent : C.border}`,
                background: isSel ? C.accent + '12' : C.panelB, transition: 'all .15s',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 4,
                  border: `1.5px solid ${isSel ? C.accent : C.border}`,
                  background: isSel ? C.accent : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {isSel && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 14, color: C.text }}>{opt.name}</span>
              </div>
              <span style={{ fontSize: 13, color: opt.price > 0 ? C.accentL : C.green, fontWeight: 700 }}>
                {opt.price > 0 ? `+₹${opt.price}` : 'Free'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Removable ingredients — toggle to cross out */
function RemovableSelector({ options, removed, onToggle }) {
  if (!options?.length) return null;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, color: C.muted, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
        Remove ingredients <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>(tap to remove)</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => {
          const isRemoved = removed.includes(opt);
          return (
            <button key={opt} onClick={() => onToggle(opt)}
              style={{
                padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontFamily: C.font, fontSize: 13,
                border: `1.5px solid ${isRemoved ? '#E63946' : C.border}`,
                background: isRemoved ? '#E6394622' : 'transparent',
                color: isRemoved ? '#E63946' : C.muted,
                textDecoration: isRemoved ? 'line-through' : 'none',
                fontWeight: isRemoved ? 700 : 400, transition: 'all .15s',
              }}>
              {isRemoved ? '✕ ' : ''}{opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MAIN MODAL ─────────────────────────────────────────────────────── */
export default function ItemCustomizeModal({ item, onClose, onAddToCart }) {
  const opts = item.customization || {};

  /* Build initial state from item's available options */
  const [config, setConfig] = useState({
    spiceLevel:       opts.spiceLevels?.[1]       || opts.spiceLevels?.[0] || '',
    gravyChoice:      opts.gravyOptions?.[1]       || opts.gravyOptions?.[0] || '',
    portionChoice:    opts.portionOptions?.[1]     || opts.portionOptions?.[0] || '',
    marinationChoice: opts.marinationOptions?.[0]  || '',
    cookStyleChoice:  opts.cookStyleOptions?.[0]   || '',
    proteinChoice:    opts.proteinOptions?.[0]     || '',
    breadTypeChoice:  opts.breadTypeOptions?.[1]   || opts.breadTypeOptions?.[0] || '',
    countChoice:      opts.countOptions?.[0]       || '',
    bunChoice:        opts.bunOptions?.[0]         || '',
    pattyChoice:      opts.pattyOptions?.[0]       || '',
    donenessChoice:   opts.donenessOptions?.[1]    || opts.donenessOptions?.[0] || '',
    crustChoice:      opts.crustOptions?.[1]       || opts.crustOptions?.[0] || '',
    sizeChoice:       opts.sizeOptions?.[1]        || opts.sizeOptions?.[0] || '',
    sauceChoice:      opts.sauceOptions?.[0]       || '',
    frySizeChoice:    opts.frySizeOptions?.[0]     || '',
    seasoningChoice:  opts.seasoningOptions?.[0]   || '',
    temperatureChoice:opts.temperatureOptions?.[0] || '',
    sweetnessChoice:  opts.sweetnessOptions?.[1]   || opts.sweetnessOptions?.[0] || '',
    pastaTypeChoice:  opts.pastaTypeOptions?.[0]   || '',
    selectedAddOns:   [],
    removedIngredients: [],
    specialInstructions: '',
  });

  /* Compute final price from base + selected add-ons + upcharges */
  const computePrice = (cfg) => {
    let price = item.price;
    // Add-ons
    cfg.selectedAddOns.forEach(ao => { price += ao.price; });
    // Upcharges embedded in option strings
    ['portionChoice', 'countChoice', 'sizeChoice', 'bunChoice', 'crustChoice',
     'frySizeChoice', 'breadTypeChoice', 'pattyChoice', 'proteinChoice',
     'cookStyleChoice', 'sweetnessChoice', 'sizeOptionsD', 'pastaTypeChoice']
      .forEach(k => { price += parseUpcharge(cfg[k]); });
    return price;
  };

  const [finalPrice, setFinalPrice] = useState(() => computePrice(config));

  useEffect(() => {
    setFinalPrice(computePrice(config));
  }, [config]);

  const set = (key, val) => setConfig(prev => ({ ...prev, [key]: val }));

  const toggleAddOn = (opt) => {
    setConfig(prev => {
      const exists = prev.selectedAddOns.some(s => s.name === opt.name);
      return {
        ...prev,
        selectedAddOns: exists
          ? prev.selectedAddOns.filter(s => s.name !== opt.name)
          : [...prev.selectedAddOns, { name: opt.name, price: opt.price }],
      };
    });
  };

  const toggleRemove = (ingredient) => {
    setConfig(prev => ({
      ...prev,
      removedIngredients: prev.removedIngredients.includes(ingredient)
        ? prev.removedIngredients.filter(r => r !== ingredient)
        : [...prev.removedIngredients, ingredient],
    }));
  };

  const handleAdd = () => {
    onAddToCart({
      menuItemId: item._id,
      name: item.name,
      emoji: item.emoji,
      price: item.price,
      finalPrice,
      quantity: 1,
      isCustomized: true,
      customization: config,
    });
    onClose();
  };

  /* Backdrop click closes */
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div onClick={handleBackdrop} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div style={{
        background: C.panel, borderRadius: '20px 20px 0 0', width: '100%',
        maxWidth: 580, maxHeight: '88vh', overflowY: 'auto',
        padding: '0 0 1px', animation: 'slideUp .3s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '20px 24px 16px',
          borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: C.panel, zIndex: 10,
        }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: C.panelB, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
            {item.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontFamily: C.font, fontWeight: 700, color: C.text }}>{item.name}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontStyle: 'italic' }}>{item.description}</div>
          </div>
          <button onClick={onClose} style={{ background: C.panelB, border: `1px solid ${C.border}`, borderRadius: '50%', width: 32, height: 32, color: C.muted, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Customization options — only rendered if the item has them */}
        <div style={{ padding: '20px 24px' }}>

          <SpiceSelector
            options={opts.spiceLevels}
            value={config.spiceLevel}
            onChange={v => set('spiceLevel', v)}
          />

          <ChipSelect label="Size" options={opts.sizeOptions} value={config.sizeChoice} onChange={v => set('sizeChoice', v)} />
          <ChipSelect label="Drink size" options={opts.sizeOptionsD} value={config.sizeChoice} onChange={v => set('sizeChoice', v)} />
          <ChipSelect label="Portion" options={opts.portionOptions} value={config.portionChoice} onChange={v => set('portionChoice', v)} />
          <ChipSelect label="Quantity" options={opts.countOptions} value={config.countChoice} onChange={v => set('countChoice', v)} />

          <ChipSelect label="Gravy" options={opts.gravyOptions} value={config.gravyChoice} onChange={v => set('gravyChoice', v)} />
          <ChipSelect label="Marination style" options={opts.marinationOptions} value={config.marinationChoice} onChange={v => set('marinationChoice', v)} />
          <ChipSelect label="Cook style" options={opts.cookStyleOptions} value={config.cookStyleChoice} onChange={v => set('cookStyleChoice', v)} />
          <ChipSelect label="Protein" options={opts.proteinOptions} value={config.proteinChoice} onChange={v => set('proteinChoice', v)} />

          <ChipSelect label="Bread type" options={opts.breadTypeOptions} value={config.breadTypeChoice} onChange={v => set('breadTypeChoice', v)} />

          <ChipSelect label="Bun type" options={opts.bunOptions} value={config.bunChoice} onChange={v => set('bunChoice', v)} />
          <ChipSelect label="Patty" options={opts.pattyOptions} value={config.pattyChoice} onChange={v => set('pattyChoice', v)} />
          <ChipSelect label="Doneness" options={opts.donenessOptions} value={config.donenessChoice} onChange={v => set('donenessChoice', v)} />

          <ChipSelect label="Crust type" options={opts.crustOptions} value={config.crustChoice} onChange={v => set('crustChoice', v)} />
          <ChipSelect label="Sauce base" options={opts.sauceOptions} value={config.sauceChoice} onChange={v => set('sauceChoice', v)} />

          <ChipSelect label="Pasta type" options={opts.pastaTypeOptions} value={config.pastaTypeChoice} onChange={v => set('pastaTypeChoice', v)} />

          <ChipSelect label="Fry size" options={opts.frySizeOptions} value={config.frySizeChoice} onChange={v => set('frySizeChoice', v)} />
          <ChipSelect label="Seasoning" options={opts.seasoningOptions} value={config.seasoningChoice} onChange={v => set('seasoningChoice', v)} />

          <ChipSelect label="Temperature" options={opts.temperatureOptions} value={config.temperatureChoice} onChange={v => set('temperatureChoice', v)} />
          <ChipSelect label="Sweetness" options={opts.sweetnessOptions} value={config.sweetnessChoice} onChange={v => set('sweetnessChoice', v)} />

          <AddOnSelector
            label="Add-ons"
            options={opts.addOnOptions}
            selected={config.selectedAddOns}
            onToggle={toggleAddOn}
          />

          <RemovableSelector
            options={opts.removableItems}
            removed={config.removedIngredients}
            onToggle={toggleRemove}
          />

          {/* Special instructions */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Special instructions</div>
            <textarea
              value={config.specialInstructions}
              onChange={e => set('specialInstructions', e.target.value)}
              placeholder="e.g. less oil, extra crispy, no garlic, allergy info…"
              rows={3}
              style={{
                width: '100%', padding: '12px 14px', background: C.panelB,
                border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text,
                fontSize: 13, fontFamily: C.font, resize: 'vertical', outline: 'none',
              }}
            />
          </div>

          {/* Selected summary chips */}
          {config.removedIngredients.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#E63946', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Removing</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {config.removedIngredients.map(r => (
                  <span key={r} style={{ background: '#E6394618', color: '#E63946', border: '1px solid #E6394633', padding: '3px 10px', borderRadius: 12, fontSize: 11 }}>✕ {r}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div style={{
          position: 'sticky', bottom: 0, background: C.panel,
          borderTop: `1px solid ${C.border}`, padding: '16px 24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Total price</div>
              <div style={{ fontFamily: C.font, fontSize: 22, fontWeight: 700, color: C.gold }}>₹{finalPrice}</div>
            </div>
            {config.selectedAddOns.length > 0 && (
              <div style={{ fontSize: 12, color: C.muted, textAlign: 'right' }}>
                Base ₹{item.price} + add-ons ₹{config.selectedAddOns.reduce((s, a) => s + a.price, 0)}
              </div>
            )}
          </div>
          <button onClick={handleAdd} style={{
            width: '100%', padding: 14, background: C.accent, color: '#fff',
            border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer',
            fontSize: 16, fontFamily: C.font,
          }}>
            Add to Cart — ₹{finalPrice}
          </button>
        </div>
      </div>

      <style>{`@keyframes slideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}
