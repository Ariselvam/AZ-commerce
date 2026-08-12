import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');

  // 1. Load Cart on startup or when user changes
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      if (user) {
        try {
          // Logged in user: load from database
          const response = await api.get('/cart/');
          setCartItems(response.data.items || []);
        } catch (error) {
          console.error('Failed to load cart from database:', error);
        }
      } else {
        // Guest user: load from local storage
        const guestCart = localStorage.getItem('guest_cart');
        if (guestCart) {
          setCartItems(JSON.parse(guestCart));
        } else {
          setCartItems([]);
        }
      }
      setLoading(false);
    };

    loadCart();
  }, [user]);

  // Helper to persist guest cart
  const saveGuestCart = (items) => {
    setCartItems(items);
    localStorage.setItem('guest_cart', JSON.stringify(items));
  };

  // 2. Add Item to Cart
  const addToCart = async (product, quantity = 1) => {
    setWarning('');
    if (user) {
      // API call
      try {
        const response = await api.post('/cart/add/', {
          product_id: product.id,
          quantity: quantity
        });
        if (response.data.warning) {
          setWarning(response.data.warning);
          setCartItems(response.data.cart.items || []);
        } else {
          setCartItems(response.data.items || []);
        }
        return { success: true };
      } catch (error) {
        const msg = error.response?.data?.error || 'Failed to add item to cart.';
        return { success: false, error: msg };
      }
    } else {
      // Guest logic
      const items = [...cartItems];
      const existingItemIndex = items.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        const newQty = items[existingItemIndex].quantity + quantity;
        if (newQty > product.stock) {
          items[existingItemIndex].quantity = product.stock;
          setWarning(`Quantity capped at available stock (${product.stock}).`);
        } else {
          items[existingItemIndex].quantity = newQty;
        }
      } else {
        if (quantity > product.stock) {
          items.push({
            id: Date.now(), // temporary local id
            product: product,
            quantity: product.stock,
            item_total: (product.stock * parseFloat(product.discount_price || product.price)).toFixed(2)
          });
          setWarning(`Quantity capped at available stock (${product.stock}).`);
        } else {
          items.push({
            id: Date.now(),
            product: product,
            quantity: quantity,
            item_total: (quantity * parseFloat(product.discount_price || product.price)).toFixed(2)
          });
        }
      }

      // Re-calculate totals for items
      const updatedItems = items.map(item => ({
        ...item,
        item_total: (item.quantity * parseFloat(item.product.discount_price || item.product.price)).toFixed(2)
      }));

      saveGuestCart(updatedItems);
      return { success: true };
    }
  };

  // 3. Update Quantity
  const updateQuantity = async (itemId, quantity) => {
    setWarning('');
    if (user) {
      try {
        const response = await api.put(`/cart/item/${itemId}/`, { quantity });
        setCartItems(response.data.items || []);
        return { success: true };
      } catch (error) {
        const msg = error.response?.data?.error || 'Failed to update quantity.';
        return { success: false, error: msg };
      }
    } else {
      // Guest updates by local item ID
      if (quantity <= 0) {
        removeFromCart(itemId);
        return { success: true };
      }
      
      const items = cartItems.map(item => {
        if (item.id === itemId) {
          const activeQty = quantity > item.product.stock ? item.product.stock : quantity;
          if (quantity > item.product.stock) {
            setWarning(`Only ${item.product.stock} items left in stock.`);
          }
          return {
            ...item,
            quantity: activeQty,
            item_total: (activeQty * parseFloat(item.product.discount_price || item.product.price)).toFixed(2)
          };
        }
        return item;
      });
      saveGuestCart(items);
      return { success: true };
    }
  };

  // 4. Remove Item
  const removeFromCart = async (itemId) => {
    setWarning('');
    if (user) {
      try {
        const response = await api.delete(`/cart/item/${itemId}/`);
        setCartItems(response.data.items || []);
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to remove item.' };
      }
    } else {
      const items = cartItems.filter(item => item.id !== itemId);
      saveGuestCart(items);
      return { success: true };
    }
  };

  // 5. Clear Cart
  const clearCart = async () => {
    setWarning('');
    if (user) {
      try {
        const response = await api.delete('/cart/clear/');
        setCartItems(response.data.items || []);
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      saveGuestCart([]);
    }
  };

  // Calculators
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.item_total), 0);
  // Free delivery above ₹500, else ₹40
  const cartDeliveryCharge = cartSubtotal >= 500 || cartCount === 0 ? 0 : 40;
  const cartTotal = cartSubtotal + cartDeliveryCharge;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        warning,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDeliveryCharge,
        cartTotal,
        setWarning
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
