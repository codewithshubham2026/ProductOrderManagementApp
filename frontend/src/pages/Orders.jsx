import React, { useState, useEffect } from 'react';
import api from '../api';
import OrderCard from '../components/OrderCard';

// Orders page - shows user's order history
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page]);

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
    return <div className="container loading">Loading orders...</div>;
  }

  return (
    <div className="container">
      <h1>My Orders</h1>
      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="card">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}

          {pagination.pages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
