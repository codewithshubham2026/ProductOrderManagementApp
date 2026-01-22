import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

// Order detail page - shows full order information
export default function OrderDetail() {
  const { id } = useParams();
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

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  if (loading) {
    return <div className="container loading">Loading...</div>;
  }

  if (error || !order) {
    return (
      <div className="container">
        <div className="alert alert-error">{error || 'Order not found'}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Order Details</h1>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className={getStatusClass(order.status)}>{order.status.toUpperCase()}</span>
        </div>

        <h3>Items</h3>
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <div>
              <h4>{item.product.name}</h4>
              <p>Quantity: {item.quantity} × ${item.price.toFixed(2)}</p>
            </div>
            <p><strong>${(item.quantity * item.price).toFixed(2)}</strong></p>
          </div>
        ))}

        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #eee' }}>
          <h3>Total: ${order.totalAmount.toFixed(2)}</h3>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Shipping Address</h3>
          <p>{order.shippingAddress.street}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.zipCode}
          </p>
        </div>
      </div>
    </div>
  );
}
