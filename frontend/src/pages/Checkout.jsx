import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

const Checkout = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { cartItems, cartSubtotal, cartDeliveryCharge, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Form States
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pre-populate shipping data if user has default details saved
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    // Redirect to login page with a return path
    return <Navigate to="/login?redirect=checkout" replace />;
  }

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    // Quick validations
    const requiredFields = ['full_name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        setError(`Please fill in all shipping fields.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        ...formData,
        payment_method: paymentMethod,
      };

      const response = await api.post('/orders/', orderPayload);
      
      // Clear local cart state (Backend cart cleared during transaction)
      clearCart();
      
      // Redirect to Order Success
      navigate(`/order-success?order_id=${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place the order. Please verify stock availability and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section" style={{ animation: 'slideUp 0.5s ease' }}>
      <h2>Checkout Details</h2>
      {error && (
        <div className="auth-error-alert" style={{ marginTop: '15px' }}>
          {error}
        </div>
      )}

      <div className="checkout-layout">
        {/* Shipping Form Panel */}
        <form onSubmit={handlePlaceOrder} className="checkout-form-panel">
          <h3 className="checkout-section-title">Shipping Address</h3>
          
          <div className="form-grid">
            <div className="form-group form-grid-full">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="full_name"
                className="form-input"
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group form-grid-full">
              <label className="form-label">Street Address</label>
              <textarea
                name="address"
                className="form-input"
                style={{ resize: 'vertical', minHeight: '80px' }}
                value={formData.address}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-input"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                className="form-input"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode (ZIP)</label>
              <input
                type="text"
                name="pincode"
                className="form-input"
                value={formData.pincode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <h3 className="checkout-section-title" style={{ marginTop: '20px' }}>Payment Mode</h3>
          <div className="payment-options">
            <div
              className={`payment-option-card ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('Cash on Delivery')}
            >
              <input
                type="radio"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={() => {}}
              />
              <div>
                <span className="payment-option-title">Cash on Delivery (COD)</span>
                <p className="payment-option-desc">Pay with cash upon delivery of your products.</p>
              </div>
            </div>

            <div
              className={`payment-option-card ${paymentMethod === 'Online Payment' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('Online Payment')}
            >
              <input
                type="radio"
                checked={paymentMethod === 'Online Payment'}
                onChange={() => {}}
              />
              <div>
                <span className="payment-option-title">Simulated Online Payment Gate</span>
                <p className="payment-option-desc">Demo gateway. No real money deducted during evaluation.</p>
              </div>
            </div>
          </div>
        </form>

        {/* Right Side: Order Items & Subtotals Summary */}
        <div className="cart-summary-panel">
          <h3 className="summary-title">Order Items</h3>
          
          <div className="checkout-items-summary">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-summary-item">
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                  {item.product.name} <strong>x {item.quantity}</strong>
                </span>
                <span style={{ fontWeight: '600' }}>
                  ₹{parseFloat(item.item_total).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="summary-row">
              <span>Subtotal</span>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Surcharge</span>
              <span>{cartDeliveryCharge === 0 ? "FREE" : `₹${cartDeliveryCharge}`}</span>
            </div>

            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px', backgroundColor: 'var(--accent)' }}
          >
            {submitting ? 'Placing Order...' : 'Confirm & Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
