import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

// Product detail page - shows full product information and allows adding to cart/order
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
    return <div className="container loading">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="alert alert-error">{error || 'Product not found'}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div>
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          )}
        </div>
        <div>
          <h1>{product.name}</h1>
          <span className="category">{product.category}</span>
          <p className="price" style={{ fontSize: '2rem', margin: '1rem 0' }}>
            ${product.price.toFixed(2)}
          </p>
          <p style={{ marginBottom: '1rem' }}>{product.description}</p>
          <p><strong>Stock:</strong> {product.stock} units available</p>

          {product.stock > 0 ? (
            <div style={{ marginTop: '2rem' }}>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{ width: '100px' }}
                />
              </div>
              <button className="btn btn-success" onClick={handleAddToOrder}>
                Add to Order
              </button>
            </div>
          ) : (
            <div className="alert alert-error" style={{ marginTop: '1rem' }}>
              Out of stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
