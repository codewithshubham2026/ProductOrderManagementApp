import React, { useState, useEffect } from 'react';
import api from '../api';
import Select from '../components/Select';
import styles from '../styles/ui.module.css';

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
    <div className={styles.container}>
      <div className={`${styles.pageHeader} ${styles.compact}`}>
        <div>
          <p className={styles.eyebrow}>Concierge</p>
          <h1 className={styles.pageTitle}>AI Product Assistant</h1>
          <p className={styles.pageSubtitle}>
            Ask questions about our products and get helpful answers powered by AI.
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Select Product (Optional)</label>
            <Select
              value={productId}
              onChange={setProductId}
              options={[
                { value: '', label: 'General Question' },
                ...products.map((product) => ({ value: product._id, label: product.name }))
              ]}
              placeholder="General Question"
              ariaLabel="Select product"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Your Question</label>
            <textarea
              className={`${styles.textareaBase} ${styles.textareaField}`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about our products..."
              required
              rows={4}
            />
          </div>
          <button
            type="submit"
            className={`${styles.buttonBase} ${styles.btn} ${styles.btnPrimary}`}
            disabled={loading}
          >
            {loading ? 'Asking AI...' : 'Ask Question'}
          </button>
        </form>
      </div>

      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

      {response && (
        <div className={styles.card}>
          <h2>AI Response</h2>
          <div className={styles.aiResponse}>
            {response}
          </div>
        </div>
      )}

      {!response && !error && (
        <div className={styles.card}>
          <p className={`${styles.muted} ${styles.textCenter}`}>
            Enter a question above to get started.
          </p>
        </div>
      )}
    </div>
  );
}
