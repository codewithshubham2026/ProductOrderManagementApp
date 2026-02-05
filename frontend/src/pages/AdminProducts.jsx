// Import React hooks: useState for state, useEffect for side effects, useMemo for optimization
import React, { useState, useEffect, useMemo } from 'react';
// Import configured axios instance for API calls
import api from '../api';
// Import CSS module styles
import styles from '../styles/ui.module.css';

// AdminProducts component: admin interface for managing products (CRUD operations)
// This page is only accessible to users with admin role
export default function AdminProducts() {
  // State to store list of products from API
  const [products, setProducts] = useState([]);
  // State to control visibility of create/edit form
  const [showForm, setShowForm] = useState(false);
  // State to store product being edited (null if creating new product)
  const [editingProduct, setEditingProduct] = useState(null);
  // State to store ID of product pending deletion (for confirmation modal)
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  // State for current page number (for pagination)
  const [page, setPage] = useState(1);
  // State to store pagination metadata
  const [pagination, setPagination] = useState({});
  // State for form data (product fields)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });
  // State to track if products are being fetched (for loading indicator)
  const [loading, setLoading] = useState(true);
  // State to store error messages
  const [error, setError] = useState('');
  // State to store success messages
  const [success, setSuccess] = useState('');

  // Helper function to scroll page to top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // useEffect to fetch products when component mounts or page changes
  useEffect(() => {
    fetchProducts();
  }, [page]); // Dependency: re-fetch when page changes

  // Function to fetch products from API
  const fetchProducts = async () => {
    try {
      // Make GET request to products endpoint with pagination
      const { data } = await api.get('/api/products', { params: { page, limit: 12 } });
      // Update products state with fetched products
      setProducts(data.products);
      // Update pagination state with pagination metadata
      setPagination(data.pagination);
      // If current page is beyond total pages, reset to last page
      // This handles cases where products are deleted and page count decreases
      if (data.pagination.pages > 0 && page > data.pagination.pages) {
        setPage(data.pagination.pages);
      }
    } catch (err) {
      // If request fails, set error message
      setError('Failed to load products');
    } finally {
      // Always set loading to false after request completes
      setLoading(false);
    }
  };

  // Form submission handler: creates new product or updates existing one
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Clear any previous error messages
    setError('');
    // Clear any previous success messages
    setSuccess('');

    try {
      // Check if we're editing an existing product or creating a new one
      if (editingProduct) {
        // Update existing product: PUT request with product ID
        await api.put(`/api/products/${editingProduct._id}`, formData);
        setSuccess('Product updated successfully');
      } else {
        // Create new product: POST request
        await api.post('/api/products', formData);
        setSuccess('Product created successfully');
      }
      // Hide form after successful submission
      setShowForm(false);
      // Clear editing state
      setEditingProduct(null);
      // Reset form data to empty values
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: ''
      });
      // Refresh products list to show new/updated product
      fetchProducts();
      // Scroll to top to show success message
      scrollToTop();
    } catch (err) {
      // If request fails, display error message
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  // Handler function when admin clicks Edit button on a product
  const handleEdit = (product) => {
    // Set the product being edited
    setEditingProduct(product);
    // Pre-fill form with product's current data
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || '' // Use empty string if image is null/undefined
    });
    // Show the form
    setShowForm(true);
    // Scroll to top so form is visible
    scrollToTop();
  };

  // Handler function to delete a product
  const handleDelete = async (id) => {
    try {
      // Make DELETE request to remove product
      await api.delete(`/api/products/${id}`);
      // Show success message
      setSuccess('Product deleted successfully');
      // Refresh products list to remove deleted product
      fetchProducts();
    } catch (err) {
      // If deletion fails, set error message
      setError('Failed to delete product');
    }
  };

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

  if (loading) {
    return <div className={`${styles.container} ${styles.loading}`}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.pageHeader} ${styles.compact}`}>
        <div>
          <p className={styles.eyebrow}>Admin</p>
          <h1 className={styles.pageTitle}>Manage Products</h1>
          <p className={styles.pageSubtitle}>Create, update, and curate your catalog.</p>
        </div>
        <button
          className={`${styles.buttonBase} ${styles.btn} ${styles.btnPrimary}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
      {success && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>
      )}

      {showForm && (
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>
            {editingProduct ? 'Edit Product' : 'New Product'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Name</label>
              <input
                className={`${styles.inputBase} ${styles.inputField}`}
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description</label>
              <textarea
                className={`${styles.textareaBase} ${styles.textareaField}`}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Price</label>
              <input
                className={`${styles.inputBase} ${styles.inputField}`}
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category</label>
              <input
                className={`${styles.inputBase} ${styles.inputField}`}
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Stock</label>
              <input
                className={`${styles.inputBase} ${styles.inputField}`}
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Image URL (optional)</label>
              <input
                className={`${styles.inputBase} ${styles.inputField}`}
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className={`${styles.buttonBase} ${styles.btn} ${styles.btnSuccess}`}
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        </div>
      )}

      <div className={styles.productGrid}>
        {products.map((product) => (
          <div key={product._id} className={styles.productCard}>
            <div className={styles.productImage}>
              <img
                src={
                  product.image ||
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
                }
                alt={product.name}
                className={styles.productImageImg}
              />
            </div>
            <div className={styles.productMeta}>
              <span className={styles.badge}>{product.category}</span>
              <span
                className={`${styles.statusPill} ${
                  product.stock > 0 ? styles.inStock : styles.outStock
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
            <h3 className={styles.productTitle}>{product.name}</h3>
            <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
            <div className={`${styles.productActions} ${styles.productActionsRow}`}>
              <button
                className={`${styles.buttonBase} ${styles.btn} ${styles.btnPrimary}`}
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                className={`${styles.buttonBase} ${styles.btn} ${styles.btnDanger}`}
                onClick={() => setPendingDeleteId(product._id)}
                data-scroll-top="false"
              >
                Delete
              </button>
            </div>
          </div>
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

      {pendingDeleteId && (
        <div className={styles.modalBackdrop} role="presentation">
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3>Delete product?</h3>
              <button
                type="button"
                className={`${styles.buttonBase} ${styles.btn} ${styles.btnGhost} ${styles.modalClose}`}
                onClick={() => setPendingDeleteId(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className={styles.modalBody}>
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={`${styles.buttonBase} ${styles.btn} ${styles.btnGhost}`}
                onClick={() => setPendingDeleteId(null)}
                data-scroll-top="false"
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${styles.buttonBase} ${styles.btn} ${styles.btnDanger}`}
                onClick={() => {
                  handleDelete(pendingDeleteId);
                  setPendingDeleteId(null);
                }}
                data-scroll-top="false"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
