// Import React hooks: useState for state, useEffect for side effects, useMemo for optimization
import React, { useState, useEffect, useMemo } from 'react';
// Import configured axios instance for API calls
import api from '../api';
// Import OrderCard component to display individual orders
import OrderCard from '../components/OrderCard';
// Import CSS module styles
import styles from '../styles/ui.module.css';

// Orders component: displays user's order history with pagination
export default function Orders() {
  // State to store list of user's orders from API
  const [orders, setOrders] = useState([]);
  // State to store pagination metadata (total pages, current page, etc.)
  const [pagination, setPagination] = useState({});
  // State for current page number (for pagination)
  const [page, setPage] = useState(1);
  // State to track if orders are being fetched (for loading indicator)
  const [loading, setLoading] = useState(true);
  // State to store error messages
  const [error, setError] = useState('');

  // useEffect to fetch orders when component mounts or page changes
  useEffect(() => {
    fetchOrders();
  }, [page]); // Dependency: re-fetch when page changes

  // useMemo: calculate page numbers to display in pagination
  // Only recalculates when pagination.pages or page changes (performance optimization)
  const pageNumbers = useMemo(() => {
    // Get total pages from pagination, default to 0 if not available
    const totalPages = pagination.pages || 0;
    // If only one page or less, don't show pagination
    if (totalPages <= 1) return [];
    // Create array to store page numbers
    const range = [];
    // Calculate start page: show 2 pages before current, but not less than 1
    const start = Math.max(1, page - 2);
    // Calculate end page: show 2 pages after current, but not more than total pages
    const end = Math.min(totalPages, page + 2);
    // Add page numbers to range array
    for (let i = start; i <= end; i += 1) {
      range.push(i);
    }
    return range;
  }, [pagination.pages, page]); // Dependencies: recalculate when these change

  // Function to fetch user's orders from API
  const fetchOrders = async () => {
    // Set loading state to true to show loading indicator
    setLoading(true);
    // Clear any previous error messages
    setError('');
    try {
      // Make GET request to user's orders endpoint with pagination parameters
      // This endpoint only returns orders for the authenticated user
      const { data } = await api.get('/api/orders/my-orders', {
        params: { page, limit: 10 } // 10 orders per page
      });
      // Update orders state with fetched orders
      setOrders(data.orders);
      // Update pagination state with pagination metadata
      setPagination(data.pagination);
    } catch (err) {
      // If request fails, set error message
      setError('Failed to load orders');
    } finally {
      // Always set loading to false after request completes
      setLoading(false);
    }
  };

  if (loading && orders.length === 0) {
    return <div className={`${styles.container} ${styles.loading}`}>Loading orders...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.pageHeader} ${styles.compact}`}>
        <div>
          <p className={styles.eyebrow}>Account</p>
          <h1 className={styles.pageTitle}>My Orders</h1>
          <p className={styles.pageSubtitle}>
            Track your recent purchases and delivery status.
          </p>
        </div>
      </div>
      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

      {orders.length === 0 ? (
        <div className={styles.card}>
          <p className={styles.emptyStateText}>
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}

        </div>
      )}

      {pagination.pages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`${styles.buttonBase} ${styles.paginationButton}`}
          >
            Previous
          </button>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`${styles.buttonBase} ${styles.paginationButton}${
                pageNumber === page ? ` ${styles.paginationButtonActive}` : ''
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
            className={`${styles.buttonBase} ${styles.paginationButton}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
