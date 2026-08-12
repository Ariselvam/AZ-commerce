import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || '';

  return (
    <div className="container section" style={{ display: 'flex', justifyContent: 'center', animation: 'slideUp 0.5s ease' }}>
      <div
        className="empty-state"
        style={{
          maxWidth: '540px',
          padding: '50px 40px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          backgroundColor: 'white'
        }}
      >
        <div style={{ color: 'var(--success)', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <CheckCircle2 size={64} strokeWidth={1.5} />
        </div>
        
        <h2 className="empty-state-title" style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
          Order Confirmed!
        </h2>
        
        <p className="empty-state-text" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          Thank you for shopping with us. Your order has been placed successfully and is currently being processed.
        </p>

        {orderId && (
          <div
            style={{
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 24px',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: 'var(--primary)',
              margin: '10px 0'
            }}
          >
            ORDER ID: #{orderId}
          </div>
        )}

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          We will send dispatch updates and billing details shortly to your registered email.
        </p>

        <div style={{ display: 'flex', gap: '14px', width: '100%', marginTop: '10px' }}>
          <Link to="/my-orders" className="btn btn-primary" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <ShoppingBag size={18} /> View My Orders
          </Link>
          <Link to="/products" className="btn btn-secondary btn-outline" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: '8px' }}>
            Shop More <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
