// Import React library
import React from 'react';
// Import Link component from React Router for client-side navigation
import { Link } from 'react-router-dom';
// Import CSS module styles for order card component
import styles from '../styles/ui.module.css';

// OrderCard component: displays a single order in a card format
// order: object containing order data (id, status, items, total, date, etc.)
export default function OrderCard({ order }) {
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
  // Calculate total number of items in the order by summing all item quantities
  // reduce() iterates through items array and accumulates the sum
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Return JSX for order card
  return (
    // Main card container
    <div className={styles.orderCardList}>
      {/* Top section: order ID and status */}
      <div className={styles.orderCardTop}>
        {/* Order ID display section */}
        <div className={styles.orderCardId}>
          {/* Order title showing last 6 characters of order ID in uppercase */}
          <h3 className={styles.orderCardTitle}>
            Order #{order._id.slice(-6).toUpperCase()}
          </h3>
        </div>
        {/* Status badge with dynamic styling based on order status */}
        <span className={getStatusClass(order.status)}>
          {order.status.toUpperCase()}
        </span>
      </div>
      {/* Details section: order summary information */}
      <div className={styles.orderCardDetails}>
        {/* Total amount detail item */}
        <div className={styles.orderDetailItem}>
          {/* Label for total amount */}
          <span className={styles.orderDetailLabel}>Total</span>
          {/* Total amount value formatted to 2 decimal places */}
          <span className={styles.orderDetailValue}>
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>
        {/* Total items detail item */}
        <div className={styles.orderDetailItem}>
          {/* Label for item count */}
          <span className={styles.orderDetailLabel}>Items</span>
          {/* Total number of items in the order */}
          <span className={styles.orderDetailValue}>{totalItems}</span>
        </div>
        {/* Date detail item */}
        <div className={styles.orderDetailItem}>
          {/* Label for order date */}
          <span className={styles.orderDetailLabel}>Date</span>
          {/* Order creation date formatted as locale date string */}
          <span className={styles.orderDetailValue}>
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      {/* Action section: link to view full order details */}
      <div className={styles.orderCardAction}>
        {/* Link to order detail page using order ID */}
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
