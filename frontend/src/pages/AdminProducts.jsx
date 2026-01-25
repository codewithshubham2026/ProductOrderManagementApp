import React, { useState, useEffect } from 'react';
import api from '../api';
import styles from '../styles/ui.module.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/products');
      setProducts(data.products);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, formData);
        setSuccess('Product updated successfully');
      } else {
        await api.post('/api/products', formData);
        setSuccess('Product created successfully');
      }
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: ''
      });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      setSuccess('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

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
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

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
