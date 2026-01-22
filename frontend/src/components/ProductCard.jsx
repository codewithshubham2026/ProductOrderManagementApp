import React from 'react';
import { Link } from 'react-router-dom';

// Product card component - displays product information in a card format
export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      {product.image && (
        <img src={product.image} alt={product.name} />
      )}
      <span className="category">{product.category}</span>
      <h3>{product.name}</h3>
      <p className="price">${product.price.toFixed(2)}</p>
      <p>{product.description.substring(0, 100)}...</p>
      <div style={{ marginTop: '1rem' }}>
        <Link to={`/products/${product._id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
}
