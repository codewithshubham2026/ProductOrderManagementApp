import React, { useState, useEffect, useMemo, useRef } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Input from '../components/Input';
import Select from '../components/Select';
import styles from '../styles/ui.module.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, page]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/api/products/categories');
      setCategories(data.categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;

      const { data } = await api.get('/api/products', { params });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPage(1);
  };
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat, label: cat }))
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSortBy('featured');
    setPage(1);
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }, [products, sortBy]);

  const pageNumbers = useMemo(() => {
    const totalPages = pagination.pages || 0;
    if (totalPages <= 1) return [];
    const range = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i += 1) {
      range.push(i);
    }
    return range;
  }, [pagination.pages, page]);

  const showLoadingState = loading && products.length === 0;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Curated store</p>
          <h1 className={styles.pageTitle}>Discover products</h1>
          <p className={styles.pageSubtitle}>
            Shop premium picks with a glassy, modern experience inspired by the best
            ecommerce brands.
          </p>
        </div>
      </div>
      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

      <div className={`${styles.card} ${styles.filterBar}`}>
        <div className={styles.searchBar}>
          <div className={styles.searchGroup}>
            <div className={styles.searchField}>
              <span className={styles.searchLabel}>Search</span>
              <div className={styles.inputWrapper}>
                <Input
                  ref={searchInputRef}
                  type="text"
                  variant="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={handleSearch}
                  className={styles.inputWithAction}
                />
                <button
                  type="button"
                  className={`${styles.buttonBase} ${styles.inputAction}${
                    search ? ` ${styles.active}` : ` ${styles.inputActionHidden}`
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSearch('');
                    setPage(1);
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                >
                  <svg viewBox="0 0 24 24" role="presentation" className={styles.inputActionIcon}>
                    <path
                      d="M6 6l12 12M18 6l-12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className={styles.searchDivider} />
          <div className={styles.searchGroup}>
            <div className={styles.searchField}>
              <span className={styles.searchLabel}>Category</span>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={categoryOptions}
                placeholder="All Categories"
                variant="inline"
                ariaLabel="Category"
              />
            </div>
          </div>
          <div className={styles.searchDivider} />
          <div className={styles.searchGroup}>
            <div className={styles.searchField}>
              <span className={styles.searchLabel}>Sort</span>
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
                placeholder="Featured"
                variant="inline"
                ariaLabel="Sort"
              />
            </div>
          </div>
          <div className={styles.filterActions}>
          <button
            type="button"
            className={`${styles.buttonBase} ${styles.btn} ${styles.btnGhost}`}
            onClick={clearFilters}
            disabled={!search && !selectedCategory && sortBy === 'featured'}
          >
            Reset
          </button>
        </div>
        </div>
        
      </div>

      {showLoadingState ? (
        <div className={styles.card}>
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className={styles.card}>
          <p>No products found.</p>
        </div>
      ) : (
        <>
          <div className={styles.resultSummary}>
            <span>
              Showing {sortedProducts.length} item{sortedProducts.length !== 1 ? 's' : ''}
            </span>
            {pagination.pages > 1 && (
              <span>
                Page {pagination.page} of {pagination.pages}
              </span>
            )}
          </div>
          <div className={styles.productGrid}>
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`${styles.buttonBase} ${styles.paginationButton}`}
              >
                Previous
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`${styles.buttonBase} ${styles.paginationButton}${
                    pageNumber === page ? ` ${styles.paginationButtonActive}` : ''
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
                className={`${styles.buttonBase} ${styles.paginationButton}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
