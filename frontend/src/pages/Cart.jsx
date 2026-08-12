import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const {
    cartItems,
    loading,
    warning,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartDeliveryCharge,
    cartTotal,
  } = useContext(CartContext);

  const navigate = useNavigate();

  if (loading) return <div className="spinner" style={{ marginTop: '100px' }}></div>;

  return (
    <div className="container section" style={{ animation: 'slideUp 0.5s ease' }}>
      <h2>Shopping Cart</h2>
      {warning && (
        <div className="auth-error-alert" style={{ marginTop: '15px' }}>
          {warning}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '30px' }}>
          <ShoppingBag size={48} className="empty-state-icon" />
          <h3 className="empty-state-title">Your Cart is Empty</h3>
          <p className="empty-state-text">Before you proceed to checkout, you must add some products to your shopping cart. You will find lots of interesting products on our shop page.</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items List */}
          <div className="cart-items-panel">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-img-wrapper">
                  <img src={item.product.image_url} alt={item.product.name} className="cart-item-img" />
                </div>
                
                <div className="cart-item-info">
                  <span className="cart-item-category">{item.product.category_name}</span>
                  <Link to={`/product/${item.product.id}`} className="cart-item-title" style={{ fontWeight: '600' }}>
                    {item.product.name}
                  </Link>
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">
                      ₹{parseFloat(item.product.discount_price || item.product.price).toLocaleString('en-IN')}
                    </span>
                    {item.product.discount_price && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        ₹{parseFloat(item.product.price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                  {/* Quantity Controls */}
                  <div className="qty-selector">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-val" style={{ width: '30px' }}>{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span style={{ fontWeight: '700', fontSize: '1.1rem', minWidth: '100px', textAlign: 'right' }}>
                    ₹{parseFloat(item.item_total).toLocaleString('en-IN')}
                  </span>

                  {/* Remove Button */}
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove Item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Pricing Summary Panel */}
          <div className="cart-summary-panel">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Charges</span>
              <span>{cartDeliveryCharge === 0 ? "FREE" : `₹${cartDeliveryCharge}`}</span>
            </div>

            {cartDeliveryCharge > 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-8px' }}>
                Add products worth ₹{(500 - cartSubtotal).toFixed(2)} more for FREE delivery.
              </p>
            )}

            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px', backgroundColor: 'var(--accent)' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <Link to="/products" className="btn btn-secondary btn-outline btn-sm" style={{ width: '100%', textAlign: 'center' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
