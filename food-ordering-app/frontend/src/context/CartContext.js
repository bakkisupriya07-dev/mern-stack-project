import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('foodCart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('foodCart', JSON.stringify(cart));
  }, [cart]);

  // Add item — each entry can have unique customization config
  const addToCart = (item) => {
    // item shape: { menuItemId, name, emoji, price, finalPrice, quantity, restaurantId, restaurantName, customization, isCustomized }
    setCart(prev => [...prev, { ...item, cartId: Date.now() + Math.random() }]);
  };

  const removeFromCart = (cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId));

  const updateQuantity = (cartId, qty) => {
    if (qty <= 0) { removeFromCart(cartId); return; }
    setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
