import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import styles from '../styles/ui.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data.product);
    } catch (err) {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToOrder = () => {
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
        <div className={styles.card}>
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
          <p className={styles.muted}>
            Stock: {product.stock} units available
          </p>

          {product.stock > 0 ? (
            <div className={styles.orderSummary}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Quantity</label>
                <input
                  className={`${styles.inputBase} ${styles.inputField}`}
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
