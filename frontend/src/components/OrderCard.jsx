import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/ui.module.css';

export default function OrderCard({ order }) {
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
    <div className={styles.orderCardList}>
      <div className={styles.orderCardTop}>
        <div className={styles.orderCardId}>
          <h3 className={styles.orderCardTitle}>
            Order #{order._id.slice(-6).toUpperCase()}
          </h3>
        </div>
        <span className={getStatusClass(order.status)}>
          {order.status.toUpperCase()}
        </span>
      </div>
      <div className={styles.orderCardDetails}>
        <div className={styles.orderDetailItem}>
          <span className={styles.orderDetailLabel}>Total</span>
          <span className={styles.orderDetailValue}>
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>
        <div className={styles.orderDetailItem}>
          <span className={styles.orderDetailLabel}>Items</span>
          <span className={styles.orderDetailValue}>{order.items.length}</span>
        </div>
        <div className={styles.orderDetailItem}>
          <span className={styles.orderDetailLabel}>Date</span>
          <span className={styles.orderDetailValue}>
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className={styles.orderCardAction}>
        <Link
          to={`/orders/${order._id}`}
          className={`${styles.btn} ${styles.btnPrimary}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
