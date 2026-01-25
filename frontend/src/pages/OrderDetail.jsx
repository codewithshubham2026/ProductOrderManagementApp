import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import styles from '../styles/ui.module.css';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/api/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={`${styles.container} ${styles.loading}`}>Loading...</div>;
  }

  if (error || !order) {
    return (
      <div className={styles.container}>
        <div className={`${styles.alert} ${styles.alertError}`}>
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  const statusClassMap = {
    pending: styles.statusPending,
    processing: styles.statusProcessing,
    shipped: styles.statusShipped,
    delivered: styles.statusDelivered,
    cancelled: styles.statusCancelled
  };

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
