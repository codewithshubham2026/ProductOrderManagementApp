import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import styles from '../styles/ui.module.css';

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
    <div className={styles.container}>
      <div className={`${styles.pageHeader} ${styles.compact}`}>
        <div>
          <p className={styles.eyebrow}>Checkout</p>
          <h1 className={styles.pageTitle}>Create Order</h1>
          <p className={styles.pageSubtitle}>
            Review items and complete shipping details.
          </p>
        </div>
      </div>
      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

      <div className={styles.twoColumn}>
        <div>
          <h2 className={styles.sectionTitle}>Order Items</h2>
          {cart.length === 0 ? (
            <div className={styles.card}>
              <p className={styles.cartEmptyText}>
                Your cart is empty.
              </p>
              <button
                className={`${styles.buttonBase} ${styles.btn} ${styles.btnPrimary}`}
                onClick={() => navigate('/')}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className={styles.cartList}>
              {cart.map((item) => {
                const product = products[item.productId];
                if (!product) return null;
                return (
                  <div key={item.productId} className={styles.card}>
                    <div className={styles.cartItem}>
                      <div className={styles.cartItemInfo}>
                        <h3 className={styles.cartItemTitle}>{product.name}</h3>
                        <p className={styles.cartItemMeta}>
                          ${product.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className={styles.cartActions}>
                        <input
                          className={`${styles.inputBase} ${styles.cartQuantityInput}`}
                          type="number"
                          min="1"
                          max={product.stock}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                        />
                        <button
                          className={`${styles.buttonBase} ${styles.btn} ${styles.btnDanger}`}
                          onClick={() => removeFromCart(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className={styles.subtotal}>
                      Subtotal: <strong>${(product.price * item.quantity).toFixed(2)}</strong>
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Street</label>
                <input
                  className={`${styles.inputBase} ${styles.inputField}`}
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, street: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>City</label>
                <input
                  className={`${styles.inputBase} ${styles.inputField}`}
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>State</label>
                <input
                  className={`${styles.inputBase} ${styles.inputField}`}
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, state: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Zip Code</label>
                <input
                  className={`${styles.inputBase} ${styles.inputField}`}
                  type="text"
                  value={shippingAddress.zipCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.totalBox}>
                <h3 className={styles.totalBoxTitle}>
                  Total: ${calculateTotal().toFixed(2)}
                </h3>
              </div>
              <button
                type="submit"
                className={`${styles.buttonBase} ${styles.btn} ${styles.btnSuccess} ${styles.btnBlock}`}
                disabled={loading || cart.length === 0}
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
