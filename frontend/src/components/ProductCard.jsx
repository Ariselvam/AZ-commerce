import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const hasDiscount = discountPrice !== null && discountPrice < price;

  // Calculate discount percentage
  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to detail page when clicking cart button
    setAdding(true);
    await addToCart(product, 1);
    // Micro interaction: show checkmark or return to normal after 1 second
    setTimeout(() => {
      setAdding(false);
    }, 800);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    setWishlisted(!wishlisted);
  };

  // Render Star Ratings
  const renderStars = (rating) => {
    const stars = [];
    const ratingVal = parseFloat(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          fill={i <= ratingVal ? '#fbbf24' : 'none'}
          color={i <= ratingVal ? '#fbbf24' : '#d1d5db'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="card-link" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Card Image */}
        <div className="card-img-wrapper">
          <img src={product.image_url} alt={product.name} className="card-img" />
          
          {/* Wishlist Button */}
          <button
            className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
            onClick={toggleWishlist}
            title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={18} fill={wishlisted ? 'var(--danger)' : 'none'} />
          </button>

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="offer-badge">{discountPercent}% OFF</div>
          )}
        </div>

        {/* Card Body */}
        <div className="card-content">
          <span className="card-category">{product.category_name}</span>
          <h3 className="card-title" title={product.name}>{product.name}</h3>

          {/* Star Rating */}
          <div className="rating-container">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="rating-value">{parseFloat(product.rating).toFixed(1)}</span>
            <span className="rating-count">({product.num_reviews})</span>
          </div>

          {/* Footer containing Price & Cart */}
          <div className="card-footer">
            <div className="price-container">
              {hasDiscount ? (
                <>
                  <span className="price-main">₹{discountPrice.toLocaleString('en-IN')}</span>
                  <span className="price-old">₹{price.toLocaleString('en-IN')}</span>
                </>
              ) : (
                <span className="price-main">₹{price.toLocaleString('en-IN')}</span>
              )}
            </div>

            {/* Quick Add To Cart Button */}
            {product.stock > 0 ? (
              <button
                className="add-to-cart-icon-btn"
                onClick={handleAddToCart}
                disabled={adding}
                title="Add to Cart"
              >
                <ShoppingBag size={18} style={adding ? { transform: 'scale(0.8)', transition: '0.2s' } : {}} />
              </button>
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: '700', textTransform: 'uppercase' }}>
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
