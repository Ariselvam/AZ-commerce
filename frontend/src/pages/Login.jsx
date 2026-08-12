import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const redirect = searchParams.get('redirect') || '';
  const tokenExpired = searchParams.get('expired') === 'true';

  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect ? `/${redirect}` : '/');
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate(redirect ? `/${redirect}` : '/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="container auth-wrapper" style={{ animation: 'slideUp 0.5s ease' }}>
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to AZ Commerce to continue your purchase.</p>
        </div>

        {tokenExpired && (
          <div className="auth-error-alert" style={{ backgroundColor: '#fffbeb', borderColor: '#f59e0b', color: '#b45309' }}>
            Your session has expired. Please log in again.
          </div>
        )}

        {redirect === 'checkout' && (
          <div className="auth-error-alert" style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6', color: '#1d4ed8' }}>
            Please log in or register to complete your checkout.
          </div>
        )}

        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              placeholder="e.g. customer or admin"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '10px' }}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="auth-link">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
