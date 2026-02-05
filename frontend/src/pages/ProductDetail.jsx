// Import React hooks: useState for state, useEffect for side effects
import React, { useState, useEffect } from 'react';
// Import React Router hooks: useParams to get URL parameters, useNavigate for navigation
import { useParams, useNavigate } from 'react-router-dom';
// Import configured axios instance for API calls
import api from '../api';
// Import CSS module styles
import styles from '../styles/ui.module.css';

// ProductDetail component: displays detailed information about a single product
export default function ProductDetail() {
  // Extract product ID from URL parameters (e.g., /products/123 -> id = "123")
  const { id } = useParams();
  // Get navigate function for programmatic navigation
  const navigate = useNavigate();
  // State to store product data fetched from API
  const [product, setProduct] = useState(null);
  // State for quantity input value (default: 1)
  const [quantity, setQuantity] = useState(1);
  // State to track if product is being fetched (for loading indicator)
  const [loading, setLoading] = useState(true);
  // State to store error messages
  const [error, setError] = useState('');
  // State to store success messages (currently unused but available)
  const [success, setSuccess] = useState('');

  // useEffect to fetch product when component mounts or when id changes
  useEffect(() => {
    fetchProduct();
  }, [id]); // Dependency: re-fetch if product ID changes

  // Function to fetch product details from API
  const fetchProduct = async () => {
    try {
      // Make GET request to fetch product by ID
      const { data } = await api.get(`/api/products/${id}`);
      // Update product state with fetched data
      setProduct(data.product);
    } catch (err) {
      // If product not found or request fails, set error message
      setError('Product not found');
    } finally {
      // Always set loading to false after request completes
      setLoading(false);
    }
  };

  // Handler for "Add to Order" button click
  const handleAddToOrder = () => {
    // Navigate to create order page and pass product info via route state
    // This allows CreateOrder component to automatically add this product to cart
    navigate('/orders/create', {
      state: { productId: id, quantity: parseInt(quantity) }
    });
  };

  if (loading) {
    return <div className={`${styles.container} ${styles.loading}`}>Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={`${styles.alert} ${styles.alertError}`}>
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.pageHeader} ${styles.compact}`}>
        <div>
          <p className={styles.eyebrow}>Product</p>
          <h1 className={styles.pageTitle}>{product.name}</h1>
          <span className={styles.badge}>{product.category}</span>
        </div>
      </div>
      <div className={styles.productDetailGrid}>
        <div className={styles.card}>
          <div className={`${styles.productImage} ${styles.large}`}>
            <img
              src={
                product.image ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80'
              }
              alt={product.name}
              className={styles.productImageImg}
            />
          </div>
        </div>
        <div className={`${styles.card} ${styles.productDetailPanel}`}>
          <div className={styles.priceRow}>
            <span className={styles.productPrice}>${product.price.toFixed(2)}</span>
            <span
              className={`${styles.statusPill} ${
                product.stock > 0 ? styles.inStock : styles.outStock
              }`}
            >
              {product.stock > 0 ? 'In stock' : 'Out of stock'}
            </span>
          </div>
          <p className={styles.productDescription}>{product.description}</p>
          <p className={`${styles.muted} ${styles.stockLine}`}>
            Stock: {product.stock} units available
          </p>

          {product.stock > 0 ? (
            <div className={styles.orderSummary}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Quantity</label>
                <input
                  className={`${styles.inputBase} ${styles.inputField} ${styles.quantityInput}`}
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <button
                className={`${styles.buttonBase} ${styles.btn} ${styles.btnSuccess}`}
                onClick={handleAddToOrder}
              >
                Add to Order
              </button>
            </div>
          ) : (
            <div className={styles.orderSummary}>
              <div className={`${styles.alert} ${styles.alertError}`}>Out of stock</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
