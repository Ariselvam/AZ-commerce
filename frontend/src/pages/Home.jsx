import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Award, Headphones, ArrowRight } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products/?page=1'),
          api.get('/categories/')
        ]);
        
        // Take first 4 products as featured items
        setFeaturedProducts((prodRes.data.results || prodRes.data).slice(0, 4));
        setCategories(catRes.data.results || catRes.data || []);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      {/* Hero Section */}
      <section className="container" style={{ paddingTop: '20px' }}>
        <div className="hero-slider">
          <div className="hero-content">
            <span className="hero-tag">Limited Time Offers</span>
            <h1 className="hero-title">
              Shop Smart.<br />
              <span>Shop Better.</span>
            </h1>
            <p className="hero-text">
              Discover verified products at unmatched prices. From top-tier smartphones and fashion statements to cozy kitchen appliances - AZ Commerce has it all.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-accent">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/products" className="btn btn-secondary" style={{ border: '1px solid white', color: 'white' }}>
                Explore Products
              </Link>
            </div>
          </div>
          <div className="hero-img-wrapper">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
              alt="Hero banner product"
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container section">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="section-title">Shop by Categories</h2>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>Select a category to view items</p>
        </div>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="grid-categories">
            {categories.slice(0, 4).map((cat) => (
              <Link to={`/products?category=${cat.slug}`} key={cat.id} className="category-card">
                <img src={cat.image_url} alt={cat.name} className="category-img" />
                <div className="category-info">
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-desc">{cat.description || "Discover premium items"}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="container section" style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>Fresh picks selected for you</p>
          </div>
          <Link to="/products" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            View All Products <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="grid-products">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="container">
        <div className="promo-banner">
          <div className="promo-content">
            <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1.5px', opacity: 0.9 }}>
              Monsoon Bonanza Deals
            </span>
            <h2 className="promo-title">Big Deals. Better Prices.</h2>
            <p className="promo-desc">Get up to 40% OFF on all accessories and active smartwatches. Free shipping on orders above ₹500.</p>
          </div>
          <Link to="/products?category=watches" className="btn btn-outline" style={{ color: 'var(--accent)', fontWeight: '700' }}>
            View Offers
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container section" style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="section-title">Why Choose AZ Commerce</h2>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>Designed for a secure and smooth shopping experience</p>
        </div>
        <div className="why-container">
          <div className="why-card">
            <div className="why-icon">
              <Truck size={28} />
            </div>
            <h3 className="why-title">Fast Delivery</h3>
            <p className="why-desc">Superfast home delivery service across India. Dispatched within 24 hours.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <ShieldCheck size={28} />
            </div>
            <h3 className="why-title">Secure Payment</h3>
            <p className="why-desc">We support standard Cash on Delivery alongside simulated SSL checkout gates.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <Award size={28} />
            </div>
            <h3 className="why-title">Quality Products</h3>
            <p className="why-desc">All products pass extensive checklist quality controls before shipping.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <Headphones size={28} />
            </div>
            <h3 className="why-title">24/7 Support</h3>
            <p className="why-desc">Contact our friendly support desk anytime. We resolve queries within hours.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
