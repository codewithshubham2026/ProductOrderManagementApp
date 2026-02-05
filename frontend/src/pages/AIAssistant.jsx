// Import React hooks: useState for state, useEffect for side effects
import React, { useState, useEffect } from 'react';
// Import configured axios instance for API calls
import api from '../api';
// Import Select component for product selection dropdown
import Select from '../components/Select';
// Import CSS module styles
import styles from '../styles/ui.module.css';

// AIAssistant component: AI-powered product assistant for answering questions
export default function AIAssistant() {
  // State for user's question input
  const [question, setQuestion] = useState('');
  // State for selected product ID (optional, for product-specific questions)
  const [productId, setProductId] = useState('');
  // State to store list of products for dropdown selection
  const [products, setProducts] = useState([]);
  // State to store AI response text
  const [response, setResponse] = useState('');
  // State to track if AI request is in progress (for loading indicator)
  const [loading, setLoading] = useState(false);
  // State to store error messages
  const [error, setError] = useState('');

  // useEffect to fetch products when component mounts
  // Products are needed for the optional product selection dropdown
  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array: run only once on mount

  // Function to fetch products from API for dropdown selection
  const fetchProducts = async () => {
    try {
      // Make GET request to fetch products (limit 100 for dropdown)
      const { data } = await api.get('/api/products', { params: { limit: 100 } });
      // Update products state with fetched products
      setProducts(data.products);
    } catch (err) {
      // Log error to console (non-critical, so we don't show error to user)
      console.error('Failed to fetch products:', err);
    }
  };

  // Form submission handler: sends question to AI endpoint
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior (page refresh)
    e.preventDefault();
    // Clear any previous error messages
    setError('');
    // Clear any previous response
    setResponse('');
    // Set loading state to true to show loading indicator
    setLoading(true);

    try {
      // Make POST request to AI ask endpoint
      // Send question and optional productId (if selected)
      const { data } = await api.post('/api/ai/ask', {
        question,
        // Only send productId if one is selected, otherwise send undefined
        productId: productId || undefined
      });
      // Update response state with AI's answer
      setResponse(data.response);
    } catch (err) {
      // If request fails, display error message from backend or default message
      setError(err.response?.data?.message || 'Failed to get AI response');
    } finally {
      // Always set loading to false after request completes
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
