// Import React and useContext hook to access context values
import React, { useContext } from 'react';
// Import Navigate component from React Router for programmatic navigation/redirects
import { Navigate } from 'react-router-dom';
// Import AuthContext to access authentication state (user, loading)
import { AuthContext } from '../context/AuthContext';
// Import CSS module styles for loading indicator
import styles from '../styles/ui.module.css';

// ProtectedRoute component acts as a guard for routes that require authentication
// children: the component/page to render if user is authenticated
// requireRole: optional prop to restrict access to specific role (e.g., 'admin')
export default function ProtectedRoute({ children, requireRole }) {
  // Get user authentication state and loading status from AuthContext
  const { user, loading } = useContext(AuthContext);

  // If still checking authentication status, show loading indicator
  // Prevents flash of login page while checking if token is valid
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  // If no user is logged in (user is null), redirect to login page
  // replace prop replaces current history entry instead of adding new one
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If route requires specific role and user doesn't have that role, redirect to home
  // Prevents non-admin users from accessing admin-only routes
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass (user is authenticated and has required role), render the protected content
  return children;
}
