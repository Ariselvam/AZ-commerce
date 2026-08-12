import React from 'react';

const AboutUs = () => {
  return (
    <div className="container section" style={{ animation: 'slideUp 0.5s ease' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '50px' }}>
        <h2>About AZ Commerce</h2>
        <p className="section-subtitle">Learn more about our mission, vision, and how we operate.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', marginBottom: '60px' }}>
        <div>
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&auto=format&fit=crop&q=80"
            alt="Team collab"
            style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Shop Smart. Shop Better.</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
            AZ Commerce was founded as a student-built full-stack e-commerce project designed to showcase state-of-the-art web design practices. Our primary goal is to merge an outstandingly beautiful frontend layout with a highly secure and transaction-ready database backend.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
            We believe that browsing items, adding them to your cart, and keeping track of order fulfillment statuses should be completely seamless. That's why we built AZ Commerce with a royal-blue design theme, micro-animations, and full mobile optimization.
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '10px' }}>Our Mission</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>To build responsive, modern, and accessible software interfaces that make online transactions easy, reliable, and trustworthy.</p>
        </div>

        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '10px' }}>Our Values</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>We value user experience excellence, responsive mobile performance, rigorous database transaction checks, and clean source code quality.</p>
        </div>

        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '10px' }}>Our Commitment</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>To create realistic coding examples suitable for intermediate developers to learn proper React contexts, API integrations, and database architectures.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
