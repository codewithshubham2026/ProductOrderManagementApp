// Import React library
import React from 'react';
// Import Link component from React Router for client-side navigation
import { Link } from 'react-router-dom';
// Import CSS module styles for product card component
import styles from '../styles/ui.module.css';

// ProductCard component: displays a single product in a card format
// product: object containing product data (name, price, image, stock, etc.)
export default function ProductCard({ product }) {
  // Check if product is in stock: null stock means unlimited, > 0 means available
  // == null checks for both null and undefined
  const isInStock = product.stock == null || product.stock > 0;
  // Fallback image URL to use if product doesn't have an image
  const fallbackImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
  // Use product image if available, otherwise use fallback image
  const imageUrl = product.image || fallbackImage;
  // Truncate description to 100 characters if it exists, otherwise use default text
  const description = product.description
    ? `${product.description.substring(0, 100)}...`
    : 'Premium quality, designed for everyday excellence.';

  // Return JSX for product card
  return (
    // Main card container
    <div className={styles.productCard}>
      {/* Image container section */}
      <div className={styles.productImage}>
        {/* Product image with alt text for accessibility */}
        <img src={imageUrl} alt={product.name} className={styles.productImageImg} />
      </div>
      {/* Meta information section (category badge and stock status) */}
      <div className={styles.productMeta}>
        {/* Category badge showing product category */}
        <span className={styles.badge}>{product.category}</span>
        {/* Stock status pill: green if in stock, red if out of stock */}
        <span
          className={`${styles.statusPill} ${
            isInStock ? styles.inStock : styles.outStock
          }`}
        >
          {isInStock ? 'In stock' : 'Out of stock'}
        </span>
      </div>
      {/* Product name/title */}
      <h3 className={styles.productTitle}>{product.name}</h3>
      {/* Product price formatted to 2 decimal places with dollar sign */}
      <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
      {/* Product description (truncated if too long) */}
      <p className={styles.productDescription}>{description}</p>
      {/* Action buttons section */}
      <div className={styles.productActions}>
        {/* Link to product detail page using product ID */}
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
