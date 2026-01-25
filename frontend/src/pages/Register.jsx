import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import Input from '../components/Input';
import styles from '../styles/ui.module.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authWrapper}>
        <div className={`${styles.card} ${styles.authCard}`}>
          <h2 className={styles.authTitle}>Create your account</h2>
          <p className={`${styles.muted} ${styles.authSubtitle}`}>
            Join the store and unlock exclusive drops.
          </p>
          {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                  minLength={6}
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
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className={`${styles.muted} ${styles.authFooter}`}>
            Already have an account?{' '}
            <Link to="/login" className={styles.linkBase}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
