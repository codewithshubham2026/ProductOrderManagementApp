import React, { useState, useEffect } from 'react';
import api from '../api';

// AI Assistant page - allows users to ask questions about products
export default function AIAssistant() {
  const [question, setQuestion] = useState('');
  const [productId, setProductId] = useState('');
  const [products, setProducts] = useState([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/products', { params: { limit: 100 } });
      setProducts(data.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse('');
    setLoading(true);

    try {
      const { data } = await api.post('/api/ai/ask', {
        question,
        productId: productId || undefined
      });
      setResponse(data.response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Product Assistant</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Ask questions about our products and get helpful answers powered by AI.
      </p>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Product (Optional)</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">General Question</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Your Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about our products..."
              required
              rows={4}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Asking AI...' : 'Ask Question'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {response && (
        <div className="card">
          <h2>AI Response</h2>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {response}
          </div>
        </div>
      )}

      {!response && !error && (
        <div className="card">
          <p style={{ color: '#666', textAlign: 'center' }}>
            Enter a question above to get started.
          </p>
        </div>
      )}
    </div>
  );
}
