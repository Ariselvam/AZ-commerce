import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingBag, CreditCard, Heart, Check, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Gallery and Qty states
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingCart, setAddingCart] = useState(false);
  const [addingBuy, setAddingBuy] = useState(false);

  // Review Form States
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const prodRes = await api.get(`/products/${id}/`);
        const currentProduct = prodRes.data;
        setProduct(currentProduct);
        setActiveImage(currentProduct.image_url);

        // Fetch related products in the same category
        const relRes = await api.get(`/products/?category=${currentProduct.category_slug}`);
        // Filter out current product and take up to 4 items
        const filtered = (relRes.data.results || relRes.data || [])
          .filter(p => p.id !== currentProduct.id)
          .slice(0, 4);
        setRelatedProducts(filtered);

        // Fetch reviews
        const revRes = await api.get(`/products/${id}/reviews/`);
        setReviews(revRes.data.results || revRes.data || []);
      } catch (error) {
        console.error('Failed to load product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) return <div className="spinner" style={{ marginTop: '100px' }}></div>;
  if (!product) {
    return (
      <div className="container empty-state" style={{ marginTop: '80px' }}>
        <AlertCircle size={48} className="empty-state-icon" style={{ color: 'var(--danger)' }} />
        <h3 className="empty-state-title">Product Not Found</h3>
        <p className="empty-state-text">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary">Go back to products</Link>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const hasDiscount = discountPrice !== null && discountPrice < price;

  const handleQtyChange = (val) => {
    const nextVal = quantity + val;
    if (nextVal >= 1 && nextVal <= product.stock) {
      setQuantity(nextVal);
    }
  };

  const handleAddToCart = async () => {
    setAddingCart(true);
    await addToCart(product, quantity);
    setTimeout(() => setAddingCart(false), 850);
  };

  const handleBuyNow = async () => {
    setAddingBuy(true);
    await addToCart(product, quantity);
    setAddingBuy(false);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!commentInput.trim()) {
      setReviewError('Please write a comment.');
      return;
    }

    try {
      const response = await api.post(`/products/${id}/reviews/`, {
        rating: ratingInput,
        comment: commentInput
      });

      setReviews([response.data, ...reviews]);
      setCommentInput('');
      setRatingInput(5);
      setReviewSuccess('Thank you! Your review has been added.');

      // Refresh product data to update average rating & review count
      const updatedProdRes = await api.get(`/products/${id}/`);
      setProduct(updatedProdRes.data);
    } catch (err) {
      setReviewError(err.response?.data?.detail || 'Failed to submit review. You may have already reviewed this product.');
    }
  };

  // Render Star Ratings
  const renderStars = (ratingVal, interactive = false) => {
    const stars = [];
    const val = parseFloat(ratingVal);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={interactive ? 24 : 16}
          fill={i <= val ? '#fbbf24' : 'none'}
          color={i <= val ? '#fbbf24' : '#d1d5db'}
          onClick={interactive ? () => setRatingInput(i) : undefined}
          className={interactive ? 'rating-star-option' : ''}
          style={{ cursor: interactive ? 'pointer' : 'default', marginRight: '4px' }}
        />
      );
    }
    return stars;
  };

  // Render spec values dynamically or default layout if database has standard items
  const specs = [
    { name: "Brand", value: "Premium AZ Tech" },
    { name: "Category", value: product.category_name },
    { name: "Material", value: "Eco-Grade Alloy / Cotton / Mesh" },
    { name: "Model Year", value: "2026 Edition" },
    { name: "Warranty", value: "1 Year Manufacturer Warranty" },
    { name: "Origin", value: "Made in India" }
  ];

  return (
    <div className="container section" style={{ animation: 'slideUp 0.5s ease' }}>
      {/* Product Details Header Grid */}
      <div className="detail-layout">
        {/* Left Column: Image Gallery */}
        <div className="image-gallery">
          <div className="main-image-wrapper">
            <img src={activeImage} alt={product.name} className="main-image" />
          </div>
          
          {(product.image_url_2 || product.image_url_3) && (
            <div className="thumbnail-row">
              <div
                className={`thumbnail-wrapper ${activeImage === product.image_url ? 'active' : ''}`}
                onClick={() => setActiveImage(product.image_url)}
              >
                <img src={product.image_url} alt="thumbnail 1" className="thumbnail-img" />
              </div>
              
              {product.image_url_2 && (
                <div
                  className={`thumbnail-wrapper ${activeImage === product.image_url_2 ? 'active' : ''}`}
                  onClick={() => setActiveImage(product.image_url_2)}
                >
                  <img src={product.image_url_2} alt="thumbnail 2" className="thumbnail-img" />
                </div>
              )}

              {product.image_url_3 && (
                <div
                  className={`thumbnail-wrapper ${activeImage === product.image_url_3 ? 'active' : ''}`}
                  onClick={() => setActiveImage(product.image_url_3)}
                >
                  <img src={product.image_url_3} alt="thumbnail 3" className="thumbnail-img" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Information Panel */}
        <div className="detail-info">
          <div>
            <span className="detail-category">{product.category_name}</span>
            <h1 className="detail-title">{product.name}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {renderStars(product.rating)}
              <span style={{ marginLeft: '8px', fontWeight: '600', fontSize: '0.95rem' }}>
                {parseFloat(product.rating).toFixed(1)}
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              | {product.num_reviews} Customer Reviews
            </span>
            <span className={`stock-status ${product.stock > 0 ? 'stock-in' : 'stock-out'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} units left)` : 'Out of Stock'}
            </span>
          </div>

          <div className="detail-price-row">
            {hasDiscount ? (
              <>
                <span className="detail-price">₹{discountPrice.toLocaleString('en-IN')}</span>
                <span className="detail-price-old">₹{price.toLocaleString('en-IN')}</span>
                <span className="detail-discount">
                  {Math.round(((price - discountPrice) / price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="detail-price">₹{price.toLocaleString('en-IN')}</span>
            )}
          </div>

          <p className="detail-desc">{product.description}</p>

          {product.stock > 0 && (
            <div className="action-row">
              {/* Quantity increment/decrement */}
              <div className="qty-selector">
                <button className="qty-btn" onClick={() => handleQtyChange(-1)} disabled={quantity <= 1}>-</button>
                <span className="qty-val">{quantity}</span>
                <button className="qty-btn" onClick={() => handleQtyChange(1)} disabled={quantity >= product.stock}>+</button>
              </div>

              {/* Action Buttons */}
              <div className="detail-actions-btn-group">
                <button
                  className="btn btn-outline"
                  onClick={handleAddToCart}
                  disabled={addingCart}
                  style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <ShoppingBag size={18} />
                  {addingCart ? "Added to Cart!" : "Add to Cart"}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleBuyNow}
                  disabled={addingBuy}
                  style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'var(--accent)' }}
                >
                  <CreditCard size={18} />
                  Buy Now
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="btn btn-sm btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Heart size={14} fill={wishlisted ? 'var(--danger)' : 'none'} color={wishlisted ? 'var(--danger)' : 'currentColor'} />
              {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <section className="specs-section">
        <h2 style={{ fontSize: '1.4rem', borderBottom: '2px solid var(--bg-main)', paddingBottom: '10px' }}>Product Specifications</h2>
        <div className="specs-grid">
          {specs.map((s, idx) => (
            <div key={idx} className="spec-item">
              <span className="spec-name">{s.name}</span>
              <span className="spec-value">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2 style={{ fontSize: '1.4rem', borderBottom: '2px solid var(--bg-main)', paddingBottom: '10px', marginBottom: '24px' }}>
          Customer Reviews ({reviews.length})
        </h2>

        <div className="reviews-grid">
          {/* Review List */}
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews yet for this product. Be the first to share your experience!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="review-item">
                  <div className="review-user-row">
                    <div className="review-user-info">
                      <div className="user-avatar-placeholder">
                        {rev.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="review-username">{rev.username}</span>
                        <div className="stars" style={{ marginTop: '2px' }}>{renderStars(rev.rating)}</div>
                      </div>
                    </div>
                    <span className="review-date">{new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="review-text">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Panel */}
          <div>
            {user ? (
              <div className="review-form-card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Add Your Review</h3>
                
                {reviewError && <div className="auth-error-alert">{reviewError}</div>}
                {reviewSuccess && <div style={{ color: 'var(--success)', fontSize: '0.9rem', padding: '10px', backgroundColor: '#ecfdf5', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)' }}>{reviewSuccess}</div>}

                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <div style={{ display: 'flex' }}>
                      {renderStars(ratingInput, true)}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Review Comment</label>
                    <textarea
                      placeholder="Write your review details here..."
                      className="form-input form-textarea"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
                    Submit Review
                  </button>
                </form>
              </div>
            ) : (
              <div className="review-form-card" style={{ textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  You must be logged in to leave a review.
                </p>
                <Link to="/login" className="btn btn-primary btn-sm">Log In Now</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="section" style={{ borderTop: '1px solid var(--border)', marginTop: '60px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '30px' }}>Related Products</h2>
          <div className="grid-products">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
