import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API posting
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container section" style={{ animation: 'slideUp 0.5s ease' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '50px' }}>
        <h2>Contact Us</h2>
        <p className="section-subtitle">Have questions or feedback? Drop us a line and we'll reply shortly.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '50px' }}>
        {/* Contact Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Customer Support Desk</h3>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <MapPin size={22} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Our Headquarters</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Sector V, Salt Lake City, Kolkata, West Bengal, India - 700091
                  </p>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Phone size={22} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Call Toll-Free</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    +91 98765 43210 (9:00 AM to 6:00 PM IST)
                  </p>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Mail size={22} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Email Inquiries</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    support@azcommerce.com
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Message Input Form */}
        <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '30px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Write to Us</h3>

          {submitted && (
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
              <CheckCircle size={18} /> Thank you! Your inquiry was sent successfully. We will reply via email shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
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
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                className="form-input"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message Details</label>
              <textarea
                name="message"
                className="form-input"
                style={{ resize: 'vertical', minHeight: '120px' }}
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 30px' }}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
