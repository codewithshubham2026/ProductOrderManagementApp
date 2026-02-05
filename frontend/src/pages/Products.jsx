// Import React hooks: useState for state, useEffect for side effects, useMemo for optimization, useRef for DOM references
import React, { useState, useEffect, useMemo, useRef } from 'react';
// Import configured axios instance for API calls
import api from '../api';
// Import ProductCard component to display individual products
import ProductCard from '../components/ProductCard';
// Import Input component for search field
import Input from '../components/Input';
// Import Select component for category and sort dropdowns
import Select from '../components/Select';
// Import CSS module styles
import styles from '../styles/ui.module.css';

// Products component: main product listing page with search, filter, and pagination
export default function Products() {
  // State to store list of products from API
  const [products, setProducts] = useState([]);
  // State to store available product categories
  const [categories, setCategories] = useState([]);
  // State for search query input value
  const [search, setSearch] = useState('');
  // State for selected category filter (empty string means all categories)
  const [selectedCategory, setSelectedCategory] = useState('');
  // State for sort option (featured, price-low, price-high, name-asc, name-desc)
  const [sortBy, setSortBy] = useState('featured');
  // State for current page number (for pagination)
  const [page, setPage] = useState(1);
  // State to store pagination metadata (total pages, current page, etc.)
  const [pagination, setPagination] = useState({});
  // State to track if products are being fetched (for loading indicator)
  const [loading, setLoading] = useState(true);
  // State to store error messages
  const [error, setError] = useState('');
  // Ref to access search input DOM element (for focusing after clearing search)
  const searchInputRef = useRef(null);

  // useEffect to fetch categories once when component mounts
  // Empty dependency array [] means this runs only once on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // useEffect to fetch products whenever search, category, or page changes
  // This ensures products are re-fetched when filters change
  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, page]); // Dependencies: re-run when any of these change

  // Function to fetch all available product categories from API
  const fetchCategories = async () => {
    try {
      // Make GET request to categories endpoint
      const { data } = await api.get('/api/products/categories');
      // Update categories state with fetched data
      setCategories(data.categories);
    } catch (err) {
      // Log error to console (non-critical, so we don't show error to user)
      console.error('Failed to fetch categories:', err);
    }
  };

  // Function to fetch products from API with current filters and pagination
  const fetchProducts = async () => {
    // Set loading state to true to show loading indicator
    setLoading(true);
    // Clear any previous error messages
    setError('');
    try {
      // Build query parameters object
      const params = { page, limit: 12 }; // Always include page and limit
      // Add search parameter if search query exists
      if (search) params.search = search;
      // Add category parameter if category is selected
      if (selectedCategory) params.category = selectedCategory;

      // Make GET request to products endpoint with query parameters
      // Backend handles search and category filtering server-side
      const { data } = await api.get('/api/products', { params });
      // Update products state with fetched products
      setProducts(data.products);
      // Update pagination state with pagination metadata from backend
      setPagination(data.pagination);
    } catch (err) {
      // If request fails, set error message to display to user
      setError('Failed to load products');
    } finally {
      // Always set loading to false after request completes
      setLoading(false);
    }
  };

  // Handler for search input changes
  const handleSearch = (e) => {
    // Update search state with input value
    setSearch(e.target.value);
    // Reset to page 1 when search changes (new search starts from first page)
    setPage(1);
  };

  // Handler for category filter changes
  const handleCategoryChange = (value) => {
    // Update selected category state
    setSelectedCategory(value);
    // Reset to page 1 when category changes (new filter starts from first page)
    setPage(1);
  };
  // Create options array for category Select dropdown
  // First option is "All Categories" with empty value, then map categories to options
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat, label: cat }))
  ];

  // Create options array for sort Select dropdown
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];

  // Function to reset all filters to default values
  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSortBy('featured');
    setPage(1);
  };

  // useMemo: memoize sorted products to avoid re-sorting on every render
  // Only re-sorts when products or sortBy changes (performance optimization)
  const sortedProducts = useMemo(() => {
    // Create a copy of products array (don't mutate original)
    const sorted = [...products];
    // Switch statement to apply different sorting based on sortBy value
    switch (sortBy) {
      // Sort by price ascending (low to high)
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      // Sort by price descending (high to low)
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      // Sort by name alphabetically (A to Z)
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      // Sort by name reverse alphabetically (Z to A)
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      // Default: return products in original order (featured/unsorted)
      default:
        return sorted;
    }
  }, [products, sortBy]); // Dependencies: re-compute when products or sortBy changes

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
