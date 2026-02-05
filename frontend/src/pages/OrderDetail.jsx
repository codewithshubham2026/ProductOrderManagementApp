// Import React hooks: useState for state, useEffect for side effects
import React, { useState, useEffect } from 'react';
// Import React Router hooks: useParams to get URL parameters, useNavigate for navigation
import { useParams, useNavigate } from 'react-router-dom';
// Import configured axios instance for API calls
import api from '../api';
// Import CSS module styles
import styles from '../styles/ui.module.css';

// OrderDetail component: displays detailed information about a single order
export default function OrderDetail() {
  // Extract order ID from URL parameters (e.g., /orders/123 -> id = "123")
  const { id } = useParams();
  // Get navigate function for programmatic navigation
  const navigate = useNavigate();
  // State to store order data fetched from API
  const [order, setOrder] = useState(null);
  // State to track if order is being fetched (for loading indicator)
  const [loading, setLoading] = useState(true);
  // State to store error messages
  const [error, setError] = useState('');

  // useEffect to fetch order when component mounts or when id changes
  useEffect(() => {
    fetchOrder();
  }, [id]); // Dependency: re-fetch if order ID changes

  // Function to fetch order details from API
  const fetchOrder = async () => {
    try {
      // Make GET request to fetch order by ID
      const { data } = await api.get(`/api/orders/${id}`);
      // Update order state with fetched data
      setOrder(data.order);
    } catch (err) {
      // If order not found or request fails, set error message
      setError('Order not found');
    } finally {
      // Always set loading to false after request completes
      setLoading(false);
    }
  };

  // Show loading indicator while fetching order
  if (loading) {
    return <div className={`${styles.container} ${styles.loading}`}>Loading...</div>;
  }

  // Show error message if order not found or error occurred
  if (error || !order) {
    return (
      <div className={styles.container}>
        <div className={`${styles.alert} ${styles.alertError}`}>
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  // Map order status values to corresponding CSS classes for styling
  const statusClassMap = {
    pending: styles.statusPending,
    processing: styles.statusProcessing,
    shipped: styles.statusShipped,
    delivered: styles.statusDelivered,
    cancelled: styles.statusCancelled
  };

  // Function to get the appropriate CSS class for a given order status
  // Returns base statusBadge class plus the status-specific class
  const getStatusClass = (status) => {
    return `${styles.statusBadge} ${statusClassMap[status] || ''}`;
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.pageHeader} ${styles.compact}`}>
        <div>
          <p className={styles.eyebrow}>Order</p>
          <h1 className={styles.pageTitle}>Order Details</h1>
        </div>
        <button
          type="button"
          className={`${styles.buttonBase} ${styles.btn} ${styles.btnGhost}`}
          onClick={() => navigate('/orders')}
        >
          Back to My Orders
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.orderCardHeader}>
          <div className={styles.orderInfo}>
            <div className={styles.orderInfoItem}>
              <span className={styles.orderLabel}>Order ID</span>
              <span className={styles.orderValue}>
                {order._id.slice(-12).toUpperCase()}
              </span>
            </div>
            <div className={styles.orderInfoItem}>
              <span className={styles.orderLabel}>Date</span>
              <span className={styles.orderValue}>
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          <div className={styles.orderStatusWrapper}>
            <span className={getStatusClass(order.status)}>
              {order.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className={styles.orderSection}>
          <h3 className={styles.orderSectionTitle}>Items</h3>
          <div className={styles.orderItemsList}>
            {order.items.map((item, index) => (
              <div key={index} className={styles.orderItemCard}>
                <div className={styles.orderItemInfo}>
                  <h4 className={styles.orderItemName}>{item.product.name}</h4>
                  <p className={styles.orderItemDetails}>
                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className={styles.orderItemPrice}>
                  ${(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.orderTotalSection}>
          <div className={styles.orderTotalBox}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalAmount}>
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className={styles.orderSection}>
          <h3 className={styles.orderSectionTitle}>Shipping Address</h3>
          <div className={styles.shippingAddressBox}>
            <p className={styles.shippingAddressLine}>
              {order.shippingAddress.street}
            </p>
            <p className={`${styles.shippingAddressLine} ${styles.shippingAddressLineMuted}`}>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
