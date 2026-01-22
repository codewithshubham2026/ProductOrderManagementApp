import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Navigation bar component - shows different links based on user role
export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <h1>🛍️ Product Store</h1>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/">Products</Link>
            <Link to="/orders">My Orders</Link>
            {user.role === 'admin' && (
              <>
                <Link to="/admin/products">Manage Products</Link>
                <Link to="/admin/orders">All Orders</Link>
              </>
            )}
            <Link to="/ai-assistant">AI Assistant</Link>
            <span>Hello, {user.name}</span>
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
