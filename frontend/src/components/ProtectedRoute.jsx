import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/ui.module.css';

// Protected route component - redirects to login if user is not authenticated
// Can also require specific role (admin)
export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
