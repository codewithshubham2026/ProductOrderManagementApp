// Import React hooks: useState for state, useEffect for side effects, useMemo for optimization
import React, { useState, useEffect, useMemo } from 'react';
// Import configured axios instance for API calls
import api from '../api';
// Import Select component for status filter and status update dropdowns
import Select from '../components/Select';
// Import CSS module styles
import styles from '../styles/ui.module.css';

// AdminOrders component: admin interface for viewing and managing all orders
// This page is only accessible to users with admin role
export default function AdminOrders() {
  // State to store list of all orders from API
  const [orders, setOrders] = useState([]);
  // State to store pagination metadata
  const [pagination, setPagination] = useState({});
  // State for current page number (for pagination)
  const [page, setPage] = useState(1);
  // State for status filter (empty string means show all statuses)
  const [statusFilter, setStatusFilter] = useState('');
  // State to track if orders are being fetched (for loading indicator)
  const [loading, setLoading] = useState(true);
  // State to store error messages
  const [error, setError] = useState('');

  // useEffect to fetch orders when component mounts or when page/filter changes
  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]); // Dependencies: re-fetch when page or filter changes

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

  // Array of status options for filter and update dropdowns
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Map order status values to corresponding CSS classes for styling
  const statusClassMap = {
    pending: styles.statusPending,
    processing: styles.statusProcessing,
    shipped: styles.statusShipped,
    delivered: styles.statusDelivered,
    cancelled: styles.statusCancelled
  };

  // Function to fetch all orders from API (admin endpoint)
  const fetchOrders = async () => {
    // Set loading state to true to show loading indicator
    setLoading(true);
    // Clear any previous error messages
    setError('');
    try {
      // Build query parameters object
      const params = { page, limit: 10 }; // Always include page and limit
      // Add status filter parameter if a status is selected
      if (statusFilter) params.status = statusFilter;

      // Make GET request to admin orders endpoint (returns all orders, not just user's)
      const { data } = await api.get('/api/orders/admin/all', { params });
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

  // Handler function to update an order's status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // Make PUT request to update order status
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      // Refresh orders list to show updated status
      fetchOrders();
    } catch (err) {
      // If update fails, set error message
      setError('Failed to update order status');
    }
  };

  if (loading && orders.length === 0) {
    return <div className={`${styles.container} ${styles.loading}`}>Loading orders...</div>;
  }

  return (
    <div className={styles.container} data-scroll-top="false">
      <div className={`${styles.pageHeader} ${styles.compact}`}>
        <div>
          <p className={styles.eyebrow}>Admin</p>
          <h1 className={styles.pageTitle}>All Orders</h1>
          <p className={styles.pageSubtitle}>
            Monitor fulfillment, update statuses, and assist customers.
          </p>
        </div>
      </div>
      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

      <div className={styles.adminFilterCard}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <Select
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            options={statusOptions}
            placeholder="All Statuses"
            ariaLabel="Filter by status"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className={styles.card}>
          <p className={styles.emptyStateText}>
            No orders found.
          </p>
        </div>
      ) : (
        <div className={styles.adminOrdersList}>
          {orders.map((order) => (
            <div key={order._id} className={styles.adminOrderCard}>
              <div className={styles.adminOrderHeader}>
                <div className={styles.adminOrderInfo}>
                  <h3 className={styles.adminOrderId}>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h3>
                  <div className={styles.adminOrderMeta}>
                    <div className={styles.adminMetaItem}>
                      <span className={styles.adminMetaLabel}>Customer</span>
                      <span className={styles.adminMetaValue}>
                        {order.user.name} ({order.user.email})
                      </span>
                    </div>
                    <div className={styles.adminMetaItem}>
                      <span className={styles.adminMetaLabel}>Total</span>
                      <span className={styles.adminMetaValue}>
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className={styles.adminMetaItem}>
                      <span className={styles.adminMetaLabel}>Date</span>
                      <span className={styles.adminMetaValue}>
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.adminMetaItem}>
                      <span className={styles.adminMetaLabel}>Items</span>
                      <span className={styles.adminMetaValue}>{order.items.length}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.adminOrderActions}>
                  <div className={styles.adminStatusBadgeWrapper}>
                    <span
                      className={`${styles.statusBadge} ${statusClassMap[order.status] || ''}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <div className={styles.adminStatusControl}>
                    <label className={styles.adminStatusLabel}>Update Status</label>
                    <Select
                      value={order.status}
                      onChange={(value) => handleStatusUpdate(order._id, value)}
                      options={statusOptions.filter((option) => option.value)}
                      placeholder="Update Status"
                      ariaLabel="Update status"
                    />
                  </div>
                </div>
              </div>
            </div>
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
