import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/ui.module.css';

export default function ProductCard({ product }) {
  const isInStock = product.stock == null || product.stock > 0;
  const fallbackImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
  const imageUrl = product.image || fallbackImage;
  const description = product.description
    ? `${product.description.substring(0, 100)}...`
    : 'Premium quality, designed for everyday excellence.';

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <img src={imageUrl} alt={product.name} className={styles.productImageImg} />
      </div>
      <div className={styles.productMeta}>
        <span className={styles.badge}>{product.category}</span>
        <span
          className={`${styles.statusPill} ${
            isInStock ? styles.inStock : styles.outStock
          }`}
        >
          {isInStock ? 'In stock' : 'Out of stock'}
        </span>
      </div>
      <h3 className={styles.productTitle}>{product.name}</h3>
      <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
      <p className={styles.productDescription}>{description}</p>
      <div className={styles.productActions}>
        <Link
          to={`/products/${product._id}`}
          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
