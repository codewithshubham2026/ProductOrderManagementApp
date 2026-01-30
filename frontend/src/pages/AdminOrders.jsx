import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import Select from '../components/Select';
import styles from '../styles/ui.module.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const pageNumbers = useMemo(() => {
    const totalPages = pagination.pages || 0;
    if (totalPages <= 1) return [];
    const range = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i += 1) {
      range.push(i);
    }
    return range;
  }, [pagination.pages, page]);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const statusClassMap = {
    pending: styles.statusPending,
    processing: styles.statusProcessing,
    shipped: styles.statusShipped,
    delivered: styles.statusDelivered,
    cancelled: styles.statusCancelled
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;

      const { data } = await api.get('/api/orders/admin/all', { params });
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
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
