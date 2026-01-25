import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import OrderCard from '../components/OrderCard';
import styles from '../styles/ui.module.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page]);

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

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/orders/my-orders', {
        params: { page, limit: 10 }
      });
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
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
