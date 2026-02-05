// Import React hooks: useState for state, useEffect for side effects, useRef for persistent values
import React, { useState, useEffect, useRef } from 'react';
// Import React Router hooks: useNavigate for navigation, useLocation for route state
import { useNavigate, useLocation } from 'react-router-dom';
// Import configured axios instance for API calls
import api from '../api';
// Import CSS module styles
import styles from '../styles/ui.module.css';

// CreateOrder component: shopping cart and checkout page
export default function CreateOrder() {
  // Get navigate function for programmatic navigation
  const navigate = useNavigate();
  // Get location object to access route state (passed from ProductDetail)
  const location = useLocation();
  // Ref to track if we've already added product from ProductDetail (prevents duplicate adds)
  // useRef persists across re-renders but doesn't trigger re-renders when changed
  const didSeedFromProduct = useRef(false);
  // State for cart items: array of { productId, quantity } objects
  const [cart, setCart] = useState([]);
  // State for product details: object mapping productId to product data
  // This stores full product info for each item in cart
  const [products, setProducts] = useState({});
  // State for shipping address form fields
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  // State to track if order submission is in progress
  const [loading, setLoading] = useState(false);
  // State to store error messages
  const [error, setError] = useState('');

  // useEffect to handle product added from ProductDetail page
  // Runs when location.state changes (when navigating from ProductDetail)
  useEffect(() => {
    // If we've already processed the product from location state, don't do it again
    if (didSeedFromProduct.current) return;
    // Check if location state contains productId (means user came from ProductDetail)
    if (location.state?.productId) {
      // Mark as processed so we don't add it again on re-renders
      didSeedFromProduct.current = true;
      // Add the product to cart with specified quantity
      addToCart(location.state.productId, location.state.quantity);
    }
  }, [location.state]); // Dependency: re-run when location.state changes

  // Function to add a product to the cart
  const addToCart = async (productId, quantity) => {
    try {
      // Fetch full product details from API
      const { data } = await api.get(`/api/products/${productId}`);
      const product = data.product;

      // Update cart state: check if product already exists in cart
      setCart((prev) => {
        // Find existing cart item with same productId
        const existing = prev.find((item) => item.productId === productId);
        if (existing) {
          // If product exists, update its quantity (add to existing quantity)
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        // If product doesn't exist, add new item to cart
        return [...prev, { productId, quantity }];
      });

      // Store product details in products object for later use (display, calculations)
      setProducts((prev) => ({ ...prev, [productId]: product }));
    } catch (err) {
      // If product fetch fails, show error message
      setError('Failed to add product to cart');
    }
  };

  // Function to remove a product from the cart
  const removeFromCart = (productId) => {
    // Filter out the item with matching productId
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Function to update quantity of a product in cart
  const updateQuantity = (productId, quantity) => {
    // If quantity is 0 or negative, remove item from cart instead
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    // Update the quantity of the matching cart item
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  // Function to calculate total order amount
  const calculateTotal = () => {
    // Use reduce to sum up all item prices
    return cart.reduce((total, item) => {
      // Get product details for this cart item
      const product = products[item.productId];
      // Calculate item total (price * quantity) and add to running total
      // If product not found, add 0 (safety check)
      return total + (product ? product.price * item.quantity : 0);
    }, 0); // Start with 0 as initial total
  };

  // Form submission handler: creates the order
  const handleSubmit = async (e) => {
    // Prevent default form submission (page refresh)
    e.preventDefault();
    // Clear any previous error messages
    setError('');
    // Set loading state to show loading indicator
    setLoading(true);

    try {
      // Make POST request to create order endpoint
      // Send cart items and shipping address to backend
      const { data } = await api.post('/api/orders', {
        items: cart,
        shippingAddress
      });
      // If successful, navigate to order detail page to show confirmation
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      // If order creation fails, display error message
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      // Always set loading to false after request completes
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
