import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ShoppingBag, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const UserProfile = () => {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Profile Form States
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
      });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setUpdating(true);

    const res = await updateProfile(formData);
    setUpdating(false);

    if (res.success) {
      setMessage('Profile updated successfully.');
    } else {
      setError(res.errors?.detail || 'Failed to update profile. Please verify your details.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="container section" style={{ animation: 'slideUp 0.5s ease' }}>
      <div className="profile-layout">
        {/* Profile Navigation Left Menu */}
        <aside className="profile-nav-card">
          <div className="profile-avatar-large">
            {user.first_name ? user.first_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
          </div>
          <h3 className="profile-user-name">
            {user.first_name || user.username} {user.last_name || ''}
          </h3>
          <p className="profile-user-email">{user.email}</p>

          <div className="profile-menu-links">
            <Link to="/profile" className="profile-menu-btn active">
              <User size={18} /> My Profile
            </Link>
            <Link to="/my-orders" className="profile-menu-btn">
              <ShoppingBag size={18} /> My Orders
            </Link>
            <button
              onClick={handleLogout}
              className="profile-menu-btn"
              style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Profile Edit Right Panel */}
        <main className="profile-content-card">
          <h2 style={{ fontSize: '1.4rem', borderBottom: '2px solid var(--bg-main)', paddingBottom: '10px', marginBottom: '24px' }}>
            Account Details
          </h2>

          {message && (
            <div
              style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid var(--success)',
                color: '#047857',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle size={18} /> {message}
            </div>
          )}

          {error && (
            <div className="auth-error-alert" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-input"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-input"
                  value={formData.last_name}
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
                  disabled // typically disabled or email verified
                  style={{ backgroundColor: 'var(--bg-main)', cursor: 'not-allowed' }}
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
                />
              </div>

              <div className="form-group form-grid-full">
                <label className="form-label">Default Shipping Address</label>
                <textarea
                  name="address"
                  className="form-input"
                  style={{ resize: 'vertical', minHeight: '80px' }}
                  value={formData.address}
                  onChange={handleInputChange}
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
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="btn btn-primary"
              style={{ alignSelf: 'flex-start', padding: '12px 30px' }}
            >
              {updating ? 'Saving Details...' : 'Save Profile Details'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
