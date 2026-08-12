import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  const activeCategory = searchParams.get('category') || '';
  const activeSearch = searchParams.get('search') || '';

  // 1. Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories/');
        setCategories(res.data.results || res.data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch products whenever query parameters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Construct query parameters
        const params = new URLSearchParams();
        if (activeSearch) params.append('search', activeSearch);
        if (activeCategory) params.append('category', activeCategory);
        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);
        if (sortBy) params.append('sort_by', sortBy);
        params.append('page', currentPage.toString());

        const res = await api.get(`/products/?${params.toString()}`);
        
        // DRF uses either standard list or paginated list object
        if (res.data.results) {
          setProducts(res.data.results);
          setCount(res.data.count);
        } else {
          setProducts(res.data);
          setCount(res.data.length);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeSearch, activeCategory, minPrice, maxPrice, sortBy, currentPage]);

  const handleCategorySelect = (slug) => {
    searchParams.set('page', '1');
    setCurrentPage(1);
    if (slug === activeCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    searchParams.set('page', '1');
    setCurrentPage(1);
    
    if (minPrice) searchParams.set('min_price', minPrice);
    else searchParams.delete('min_price');

    if (maxPrice) searchParams.set('max_price', maxPrice);
    else searchParams.delete('max_price');

    setSearchParams(searchParams);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortBy(val);
    searchParams.set('sort_by', val);
    searchParams.set('page', '1');
    setCurrentPage(1);
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.ceil(count / 8); // 8 is page size from django configuration

  return (
    <div className="container section" style={{ animation: 'slideUp 0.5s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <SlidersHorizontal size={20} />
        <h2>Product Catalog</h2>
      </div>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <aside className="filter-sidebar">
          {/* Categories */}
          <div>
            <h3 className="filter-group-title">Categories</h3>
            <ul className="filter-list">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="filter-item"
                  style={{
                    fontWeight: activeCategory === cat.slug ? '700' : '400',
                    color: activeCategory === cat.slug ? 'var(--primary)' : 'inherit',
                  }}
                  onClick={() => handleCategorySelect(cat.slug)}
                >
                  <span style={{ cursor: 'pointer' }}>{cat.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div>
            <h3 className="filter-group-title">Price Range</h3>
            <form onSubmit={handlePriceApply} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min (₹)"
                  className="price-input"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max (₹)"
                  className="price-input"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm btn-outline" style={{ width: '100%' }}>
                Apply Filter
              </button>
            </form>
          </div>

          {/* Reset Filters */}
          <button
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            onClick={handleResetFilters}
          >
            <RotateCcw size={14} /> Clear All
          </button>
        </aside>

        {/* Listings Content */}
        <main>
          {/* Top Sort / Stats Header */}
          <div className="products-header">
            <span className="products-count">
              Showing {products.length} of {count} products
              {activeSearch && ` for "${activeSearch}"`}
            </span>

            <select className="sort-select" value={sortBy} onChange={handleSortChange}>
              <option value="newest">Sort By: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="spinner"></div>
          ) : products.length === 0 ? (
            <div className="empty-state" style={{ marginTop: '20px' }}>
              <h3 className="empty-state-title">No Products Found</h3>
              <p className="empty-state-text">We couldn't find any products matching your search criteria. Try modifying your search or reset filters.</p>
              <button className="btn btn-primary" onClick={handleResetFilters}>Reset All Filters</button>
            </div>
          ) : (
            <>
              <div className="grid-products">
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className="page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
