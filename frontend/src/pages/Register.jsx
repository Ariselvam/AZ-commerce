import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect') || '';

  // Form States
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect ? `/${redirect}` : '/');
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    if (formData.password !== formData.confirm_password) {
      setErrors({ confirm_password: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      // Auto-navigate to login page with a success message
      navigate(redirect ? `/login?redirect=${redirect}` : '/login');
    } else {
      // Handle structured errors from Django backend
      if (result.errors) {
        if (typeof result.errors === 'object') {
          // Flatten standard DRF array errors to strings
          const parsed = {};
          Object.keys(result.errors).forEach(key => {
            parsed[key] = Array.isArray(result.errors[key]) 
              ? result.errors[key][0] 
              : result.errors[key];
          });
          setErrors(parsed);
          
          if (parsed.non_field_errors) {
            setGeneralError(parsed.non_field_errors);
          }
        } else {
          setGeneralError('Registration failed. Please check inputs.');
        }
      }
    }
  };

  return (
    <div className="container auth-wrapper" style={{ padding: '40px 0', animation: 'slideUp 0.5s ease' }}>
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header" style={{ marginBottom: '24px' }}>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join AZ Commerce to track your shopping orders.</p>
        </div>

        {generalError && <div className="auth-error-alert">{generalError}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
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
              {errors.first_name && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.first_name}</span>}
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
              {errors.last_name && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.last_name}</span>}
            </div>

            <div className="form-group form-grid-full">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              {errors.username && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.username}</span>}
            </div>

            <div className="form-group form-grid-full">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.email}</span>}
            </div>

            <div className="form-group form-grid-full">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {errors.password && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                className="form-input"
                value={formData.confirm_password}
                onChange={handleInputChange}
                required
              />
              {errors.confirm_password && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.confirm_password}</span>}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '10px' }}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="auth-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
