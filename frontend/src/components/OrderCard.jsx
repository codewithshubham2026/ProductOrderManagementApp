import React from 'react';
import { Link } from 'react-router-dom';

// Order card component - displays order information
export default function OrderCard({ order }) {
  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Order #{order._id.slice(-6)}</h3>
        <span className={getStatusClass(order.status)}>{order.status.toUpperCase()}</span>
      </div>
      <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
      <p><strong>Items:</strong> {order.items.length}</p>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <div style={{ marginTop: '1rem' }}>
        <Link to={`/orders/${order._id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
}
