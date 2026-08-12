import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Package, Users, ShoppingBag, DollarSign, Plus, Edit, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useContext(AuthContext);

  // States
  const [stats, setStats] = useState({ total_products: 0, total_users: 0, total_orders: 0, total_revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usersList, setUsersList] = useState([]);
  
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Product Form Modal States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    discount_price: '',
    stock: '',
    image_url: '',
    description: '',
  });

  // Category Form Modal States
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    image_url: '',
    description: ''
  });

  // Fetch Dashboard Stats & Primary lists
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch Stats & Recent Orders
      const statsRes = await api.get('/orders/stats/');
      setStats(statsRes.data.stats);
      setOrders(statsRes.data.recent_orders || []);

      // 2. Fetch full list of products
      const prodRes = await api.get('/products/?page=1');
      setProducts(prodRes.data.results || prodRes.data || []);

      // 3. Fetch full list of categories
      const catRes = await api.get('/categories/');
      setCategories(catRes.data.results || catRes.data || []);

      // 4. Fetch list of users
      const usersRes = await api.get('/users/');
      setUsersList(usersRes.data.results || usersRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchDashboardData();
    }
  }, [user, isAdmin]);

  if (authLoading) return <div className="spinner" style={{ marginTop: '100px' }}></div>;
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 1. Order status patch
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status/`, { status: newStatus });
      // Update locally
      setOrders(orders.map(o => o.id === orderId ? response.data : o));
      // Re-fetch stats to sync revenue calculations
      const statsRes = await api.get('/orders/stats/');
      setStats(statsRes.data.stats);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update order status.');
    }
  };

  // 2. Product CRUD Operations
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: categories[0]?.id || '',
      price: '',
      discount_price: '',
      stock: '10',
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      description: '',
    });
    setProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      discount_price: prod.discount_price || '',
      stock: prod.stock,
      image_url: prod.image_url,
      description: prod.description,
    });
    setProductModalOpen(true);
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
        stock: parseInt(productForm.stock)
      };

      if (editingProduct) {
        // Edit Product
        const response = await api.put(`/products/${editingProduct.id}/`, payload);
        setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
      } else {
        // Add Product
        const response = await api.post('/products/', payload);
        setProducts([response.data, ...products]);
      }
      setProductModalOpen(false);
      // Re-fetch stats count
      const statsRes = await api.get('/orders/stats/');
      setStats(statsRes.data.stats);
    } catch (err) {
      alert(JSON.stringify(err.response?.data) || 'Failed to save product details.');
    }
  };

  const handleProductDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}/`);
        setProducts(products.filter(p => p.id !== productId));
        // Re-fetch stats count
        const statsRes = await api.get('/orders/stats/');
        setStats(statsRes.data.stats);
      } catch (err) {
        alert('Failed to delete product.');
      }
    }
  };

  // 3. Category Operations
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/categories/', categoryForm);
      setCategories([...categories, response.data]);
      setCategoryForm({ name: '', image_url: '', description: '' });
      setCategoryModalOpen(false);
    } catch (err) {
      alert(JSON.stringify(err.response?.data) || 'Failed to create category.');
    }
  };

  const handleCategoryDelete = async (catId) => {
    if (window.confirm('Are you sure you want to delete this category? All products under it will be deleted.')) {
      try {
        await api.delete(`/categories/${catId}/`);
        setCategories(categories.filter(c => c.id !== catId));
      } catch (err) {
        alert('Failed to delete category.');
      }
    }
  };

  return (
    <div className="container section admin-layout" style={{ animation: 'slideUp 0.5s ease' }}>
      <div>
        <h2>Admin Management Dashboard</h2>
        <p className="section-subtitle">Examine shop statistics, coordinate orders, and manage listings.</p>
      </div>

      {error && <div className="auth-error-alert">{error}</div>}

      {/* Metrics Cards Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <DollarSign size={24} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Total Revenue</span>
            <span className="admin-stat-value">₹{stats.total_revenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Total Orders</span>
            <span className="admin-stat-value">{stats.total_orders}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <Package size={24} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Total Products</span>
            <span className="admin-stat-value">{stats.total_products}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#d1fae5', color: '#047857' }}>
            <Users size={24} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Total Users</span>
            <span className="admin-stat-value">{stats.total_users}</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="admin-tabs-row">
        <span className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</span>
        <span className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Products</span>
        <span className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>Categories</span>
        <span className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</span>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {/* Tab 1: Orders Table */}
          {activeTab === 'orders' && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status Badge</th>
                    <th>Actions Toggler</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{order.full_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user_email}</div>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td style={{ fontWeight: '700' }}>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</td>
                      <td style={{ fontSize: '0.8rem', fontWeight: '600', color: order.is_paid ? 'var(--success)' : 'var(--accent)' }}>
                        {order.is_paid ? 'PAID' : 'COD / PENDING'}
                      </td>
                      <td>
                        <span className={`order-status-badge ${
                          order.status === 'Pending' ? 'status-pending' :
                          order.status === 'Confirmed' ? 'status-confirmed' :
                          order.status === 'Shipped' ? 'status-shipped' :
                          order.status === 'Delivered' ? 'status-delivered' : 'status-cancelled'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {order.status !== 'Delivered' && order.status !== 'Cancelled' ? (
                          <select
                            className="sort-select"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirm</option>
                            <option value="Shipped">Ship</option>
                            <option value="Delivered">Deliver</option>
                            <option value="Cancelled">Cancel</option>
                          </select>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Fulfillment Complete</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No orders placed yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Products Table */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button onClick={openAddProductModal} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Original Price</th>
                      <th>Discount Price</th>
                      <th>Stock Qty</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <img src={prod.image_url} alt={prod.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        </td>
                        <td style={{ fontWeight: '600' }}>{prod.name}</td>
                        <td>{prod.category_name}</td>
                        <td>₹{parseFloat(prod.price).toLocaleString('en-IN')}</td>
                        <td>{prod.discount_price ? `₹${parseFloat(prod.discount_price).toLocaleString('en-IN')}` : '-'}</td>
                        <td style={{ color: prod.stock <= 5 ? 'var(--danger)' : 'inherit', fontWeight: prod.stock <= 5 ? '700' : '400' }}>
                          {prod.stock}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => openEditProductModal(prod)} className="action-icon-btn" title="Edit" style={{ color: 'var(--primary)' }}>
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleProductDelete(prod.id)} className="action-icon-btn" title="Delete" style={{ color: 'var(--danger)' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Categories Table */}
          {activeTab === 'categories' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button onClick={() => setCategoryModalOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} /> Add Category
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Category Name</th>
                      <th>Slug</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td>
                          <img src={cat.image_url} alt={cat.name} style={{ width: '50px', height: '36px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        </td>
                        <td style={{ fontWeight: '600' }}>{cat.name}</td>
                        <td>{cat.slug}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cat.description}</td>
                        <td>
                          <button onClick={() => handleCategoryDelete(cat.id)} className="action-icon-btn" title="Delete" style={{ color: 'var(--danger)' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Users Table */}
          {activeTab === 'users' && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Role Privilege</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((usr) => (
                    <tr key={usr.id}>
                      <td>#{usr.id}</td>
                      <td style={{ fontWeight: '600' }}>{usr.username}</td>
                      <td>{usr.email}</td>
                      <td>{usr.phone || '-'}</td>
                      <td>
                        <span
                          className="order-status-badge"
                          style={{
                            backgroundColor: usr.is_admin_user || usr.is_staff ? '#fee2e2' : '#e0f2fe',
                            color: usr.is_admin_user || usr.is_staff ? '#dc2626' : '#0369a1'
                          }}
                        >
                          {usr.is_admin_user || usr.is_staff ? 'ADMIN STAFF' : 'CUSTOMER'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Product Add/Edit Modal popup */}
      {productModalOpen && (
        <div className="modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{editingProduct ? 'Edit Product Details' : 'Add New Product'}</h3>
              <button className="action-icon-btn" onClick={() => setProductModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleProductFormSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Select Category</label>
                    <select
                      className="form-input"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      required
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock Quantity</label>
                    <input
                      type="number"
                      className="form-input"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Discount Price (₹, optional)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={productForm.discount_price}
                      onChange={(e) => setProductForm({ ...productForm, discount_price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input form-textarea"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-outline btn-sm" onClick={() => setProductModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal popup */}
      {categoryModalOpen && (
        <div className="modal-overlay" onClick={() => setCategoryModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Add New Category</h3>
              <button className="action-icon-btn" onClick={() => setCategoryModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCategorySubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={categoryForm.image_url}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input form-textarea"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-outline btn-sm" onClick={() => setCategoryModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
