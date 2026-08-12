import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import api from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/');
        setOrders(response.data.results || response.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Confirmed': return 'status-confirmed';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '100px' }}></div>;

  return (
    <div className="container section" style={{ animation: 'slideUp 0.5s ease' }}>
      <h2 style={{ marginBottom: '24px' }}>My Orders</h2>

      {orders.length === 0 ? (
        <div className="empty-state">
          <Package size={48} className="empty-state-icon" />
          <h3 className="empty-state-title">No Orders Placed Yet</h3>
          <p className="empty-state-text">You haven't placed any orders with us. Start exploring our high-quality catalog to make your first purchase.</p>
          <Link to="/products" className="btn btn-primary">
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Header Info */}
              <div className="order-card-header">
                <div className="order-header-info">
                  <div>
                    <p className="order-info-label">Order Placed</p>
                    <p className="order-info-value">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="order-info-label">Total Amount</p>
                    <p className="order-info-value">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="order-info-label">Ship To</p>
                    <p className="order-info-value" title={order.address}>{order.full_name}</p>
                  </div>
                  <div>
                    <p className="order-info-label">Payment Method</p>
                    <p className="order-info-value" style={{ fontSize: '0.8rem' }}>{order.payment_method}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: order.is_paid ? 'var(--success)' : 'var(--accent)' }}>
                    {order.is_paid ? 'PAID' : 'PAYMENT PENDING'}
                  </span>
                  <span className={`order-status-badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-card-body">
                {order.items.map((item) => (
                  <div key={item.id} className="order-card-item">
                    <img
                      src={item.product_details?.image_url || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100'}
                      alt={item.product_name}
                      className="order-card-item-img"
                    />
                    
                    <div className="order-card-item-details">
                      {item.product ? (
                        <Link to={`/product/${item.product}`} className="order-card-item-name">
                          {item.product_name}
                        </Link>
                      ) : (
                        <span className="order-card-item-name">{item.product_name}</span>
                      )}
                      <p className="order-card-item-qty">Quantity: {item.quantity}</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>
                        ₹{parseFloat(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ₹{parseFloat(item.price).toLocaleString('en-IN')} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
