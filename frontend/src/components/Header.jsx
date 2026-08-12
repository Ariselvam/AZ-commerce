import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header-wrapper">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          AZ <span>Commerce</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Products</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
            </button>
          </form>

          {/* Cart Icon */}
          <Link to="/cart" className="action-icon-btn" title="View Cart">
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          {/* Profile controls */}
          <div style={{ position: 'relative' }}>
            {user ? (
              <>
                <button
                  className="action-icon-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  title="My Account"
                >
                  <User size={22} />
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '46px',
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-lg)',
                      minWidth: '180px',
                      zIndex: 105,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.first_name} {user.last_name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="profile-menu-btn"
                        style={{ borderRadius: 0, borderTop: 'none', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="profile-menu-btn"
                      style={{ borderRadius: 0, borderTop: 'none', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={16} /> My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      className="profile-menu-btn"
                      style={{ borderRadius: 0, borderTop: 'none', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <ShoppingBag size={16} /> My Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="profile-menu-btn"
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        borderRadius: 0,
                        borderTop: '1px solid var(--border)',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        color: 'var(--danger)',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburguer */}
          <button className="action-icon-btn hamburger-btn" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}>
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
              AZ <span>Commerce</span>
            </Link>
            <button className="action-icon-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products..."
              style={{ width: '100%', padding: '10px 16px', borderRadius: '50px', border: '1px solid var(--border)' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Search size={18} />
            </button>
          </form>

          <nav className="mobile-nav-links">
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
            {user ? (
              <>
                <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                <Link to="/my-orders" className="nav-link" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                {isAdmin && <Link to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>}
                <button
                  onClick={handleLogout}
                  style={{
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: 'var(--danger)',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    padding: '0'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
