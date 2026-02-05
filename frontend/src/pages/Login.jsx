// Import React hooks: useState for component state, useContext for accessing context
import React, { useState, useContext } from 'react';
// Import React Router hooks: useNavigate for programmatic navigation, Link for navigation links
import { useNavigate, Link } from 'react-router-dom';
// Import AuthContext to access login function
import { AuthContext } from '../context/AuthContext';
// Import configured axios instance for API calls
import api from '../api';
// Import reusable Input component
import Input from '../components/Input';
// Import CSS module styles
import styles from '../styles/ui.module.css';

// Login component: handles user authentication
export default function Login() {
  // State for email input value (controlled input)
  const [email, setEmail] = useState('');
  // State for password input value (controlled input)
  const [password, setPassword] = useState('');
  // State to toggle password visibility (show/hide password)
  const [showPassword, setShowPassword] = useState(false);
  // State to store and display error messages
  const [error, setError] = useState('');
  // State to track if login request is in progress (for loading indicator)
  const [loading, setLoading] = useState(false);
  // Get login function from AuthContext to update global auth state
  const { login } = useContext(AuthContext);
  // Get navigate function from React Router for programmatic navigation
  const navigate = useNavigate();

  // Form submission handler: called when user submits login form
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior (page refresh)
    e.preventDefault();
    // Clear any previous error messages
    setError('');
    // Set loading state to true to show loading indicator
    setLoading(true);

    // Try to authenticate user with backend
    try {
      // Make POST request to login endpoint with email and password
      // api.post automatically includes token if available (via interceptor)
      const { data } = await api.post('/api/auth/login', { email, password });
      // If successful, call login function from context to save token and set user
      // This updates global auth state and saves token to localStorage
      login(data.token, data.user);
      // Navigate to home page (products listing) after successful login
      navigate('/');
    } catch (err) {
      // If login fails, display error message from backend or default message
      // err.response?.data?.message safely accesses nested error message
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      // Always set loading to false after request completes (success or failure)
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authWrapper}>
        <div className={`${styles.card} ${styles.authCard}`}>
          <h2 className={styles.authTitle}>Welcome back</h2>
          <p className={`${styles.muted} ${styles.authSubtitle}`}>
            Sign in to continue shopping premium collections.
          </p>
          {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <div className={styles.inputWrapper}>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.inputWithAction}
                />
                <button
                  type="button"
                  className={`${styles.buttonBase} ${styles.inputAction}${
                    showPassword ? ` ${styles.active}` : ''
                  }`}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" role="presentation" className={styles.inputActionIcon}>
                      <path
                        d="M2.5 12s3.8-6 9.5-6 9.5 6 9.5 6-3.8 6-9.5 6-9.5-6-9.5-6z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3.4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-labelledby="eyeCrossedIconTitle"
                      stroke="#ffffff"
                      stroke-width="1.5"
                      stroke-linecap="square"
                      stroke-linejoin="miter"
                      fill="none"
                      color="#000000"
                      className={styles.inputActionIcon}
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <title id="eyeCrossedIconTitle">Hidden (crossed eye)</title>
                        <path d="M22 12C22 12 19 18 12 18C5 18 2 12 2 12C2 12 5 6 12 6C19 6 22 12 22 12Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M3 21L20 4"></path>
                      </g>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={`${styles.buttonBase} ${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className={`${styles.muted} ${styles.authFooter}`}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.linkBase}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
