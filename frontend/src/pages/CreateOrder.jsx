import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

// Create order page - allows users to create new orders
export default function CreateOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState({});
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If coming from product detail page, add that product to cart
    if (location.state?.productId) {
      addToCart(location.state.productId, location.state.quantity);
    }
  }, [location.state]);

  const addToCart = async (productId, quantity) => {
    try {
      const { data } = await api.get(`/api/products/${productId}`);
      const product = data.product;

      setCart((prev) => {
        const existing = prev.find((item) => item.productId === productId);
        if (existing) {
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { productId, quantity }];
      });

      setProducts((prev) => ({ ...prev, [productId]: product }));
    } catch (err) {
      setError('Failed to add product to cart');
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = products[item.productId];
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/api/orders', {
        items: cart,
        shippingAddress
      });
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Create Order</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <h2>Order Items</h2>
          {cart.length === 0 ? (
            <div className="card">
              <p>Your cart is empty.</p>
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Browse Products
              </button>
            </div>
          ) : (
            <div>
              {cart.map((item) => {
                const product = products[item.productId];
                if (!product) return null;
                return (
                  <div key={item.productId} className="card" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <h3>{product.name}</h3>
                        <p>${product.price.toFixed(2)} each</p>
                      </div>
                      <div>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                          style={{ width: '60px', marginRight: '1rem' }}
                        />
                        <button
                          className="btn btn-danger"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p>Subtotal: ${(product.price * item.quantity).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <div className="card">
            <h2>Shipping Address</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, street: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, state: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  value={shippingAddress.zipCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
                <h3>Total: ${calculateTotal().toFixed(2)}</h3>
              </div>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading || cart.length === 0}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {loading ? 'Creating Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
