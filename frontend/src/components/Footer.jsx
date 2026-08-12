import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* About Column */}
          <div className="footer-about">
            <h3 className="logo footer-logo">
              AZ <span>Commerce</span>
            </h3>
            <p className="footer-desc">
              AZ Commerce is a student-built full-stack e-commerce project designed to showcase state-of-the-art web design practices. Shop high-quality electronics, modern fashion apparel, comfortable sports footwear, watches, and smart kitchen appliances.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" className="social-icon" target="_blank" rel="noreferrer">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" className="social-icon" target="_blank" rel="noreferrer">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" className="social-icon" target="_blank" rel="noreferrer">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" className="social-icon" target="_blank" rel="noreferrer">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/products" className="footer-link">All Products</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h4 className="footer-col-title">Customer Service</h4>
            <ul className="footer-links">
              <li>
                <Link to="/profile" className="footer-link">My Account</Link>
              </li>
              <li>
                <Link to="/my-orders" className="footer-link">My Orders</Link>
              </li>
              <li>
                <Link to="/cart" className="footer-link">View Cart</Link>
              </li>
              <li>
                <span className="footer-link" style={{ cursor: 'pointer' }}>Return Policy</span>
              </li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div>
            <h4 className="footer-col-title">Contact Info</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <MapPin size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>Sector V, Salt Lake, Kolkata, West Bengal, India - 700091</span>
              </li>
              <li className="footer-contact-item">
                <Phone size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>+91 98765 43210</span>
              </li>
              <li className="footer-contact-item">
                <Mail size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>support@azcommerce.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AZ Commerce. All rights reserved. Built as a student portfolio project.</p>
          <p>Designed with ❤️ using React & Django REST.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
