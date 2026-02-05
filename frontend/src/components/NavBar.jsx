// Import React hooks: useContext for context access, useEffect for side effects, useRef for DOM references, useState for state
import React, { useContext, useEffect, useRef, useState } from 'react';
// Import NavLink component from React Router (similar to Link but with active state styling)
import { NavLink } from 'react-router-dom';
// Import AuthContext to access user authentication state and logout function
import { AuthContext } from '../context/AuthContext';
// Import CSS module styles for navbar component
import styles from '../styles/ui.module.css';
// Import Logo component to display brand logo
import Logo from './Logo';

// NavBar component: top navigation bar with user menu and admin dropdown
// This component is always visible at the top of the page
export default function NavBar() {
  // Get user object and logout function from AuthContext
  const { user, logout } = useContext(AuthContext);
  // State to track which dropdown menu is open ('admin', 'user', or null)
  const [openMenu, setOpenMenu] = useState(null);
  // Ref to admin dropdown container (for click outside detection)
  const adminRef = useRef(null);
  // Ref to user dropdown container (for click outside detection)
  const userRef = useRef(null);

  // useEffect to handle clicking outside dropdown menus to close them
  // Runs once on component mount (empty dependency array)
  useEffect(() => {
    // Event handler function that closes dropdowns when clicking outside
    const handleClickOutside = (event) => {
      // Check if click was inside admin dropdown
      const inAdmin = adminRef.current?.contains(event.target);
      // Check if click was inside user dropdown
      const inUser = userRef.current?.contains(event.target);
      // If click was outside both dropdowns, close any open menu
      if (!inAdmin && !inUser) {
        setOpenMenu(null);
      }
    };

    // Add event listener to document to detect clicks anywhere
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup: remove event listener when component unmounts
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Empty dependency array: run only once on mount

  // Return JSX for navigation bar
  return (
    // Nav element with CSS module styling
    <nav className={styles.navbar}>
      {/* Container div with navbar inner styling */}
      <div className={`${styles.container} ${styles.navbarInner}`}>
        {/* Brand logo link (navigates to home page) */}
        <NavLink to="/" className={`${styles.linkBase} ${styles.navbarBrand}`}>
          {/* Logo component with custom size (32px) */}
          <Logo className={styles.brandIcon} size={32} />
          {/* Company name text */}
          <span>Proget Kart</span>
        </NavLink>
        {/* Navigation links section (only shown if user is logged in) */}
        <div className={styles.navbarLinks}>
          {/* Conditional rendering: only show links if user is authenticated */}
          {user && (
            <>
              {/* Products link with active state styling */}
              <NavLink
                to="/"
                // className function receives isActive prop from React Router
                className={({ isActive }) =>
                  // Apply active class if current route matches
                  `${styles.linkBase} ${styles.navLink}${isActive ? ` ${styles.active}` : ''}`
                }
              >
                Products
              </NavLink>
              {/* Orders link with active state styling */}
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `${styles.linkBase} ${styles.navLink}${isActive ? ` ${styles.active}` : ''}`
                }
              >
                My Orders
              </NavLink>
              {/* AI Assistant link with active state styling */}
              <NavLink
                to="/ai-assistant"
                className={({ isActive }) =>
                  `${styles.linkBase} ${styles.navLink}${isActive ? ` ${styles.active}` : ''}`
                }
              >
                AI Assistant
              </NavLink>
            </>
          )}
        </div>
        {/* Right side actions section (user menu or login/register buttons) */}
        <div className={styles.navbarActions}>
          {/* Conditional rendering: show user menu if logged in, otherwise show auth buttons */}
          {user ? (
            <>
              {/* Admin dropdown menu (only shown if user has admin role) */}
              {user.role === 'admin' && (
                // Admin dropdown container with ref for click outside detection
                <div
                  className={`${styles.navDropdown}${openMenu === 'admin' ? ` ${styles.open}` : ''}`}
                  ref={adminRef}
                >
                  {/* Admin dropdown toggle button */}
                  <button
                    className={`${styles.buttonBase} ${styles.btn} ${styles.btnGhost} ${styles.navDropdownToggle}`}
                    type="button"
                    // Accessibility: indicate if dropdown is expanded
                    aria-expanded={openMenu === 'admin'}
                    // Toggle admin menu open/closed
                    onClick={() =>
                      setOpenMenu((current) => (current === 'admin' ? null : 'admin'))
                    }
                  >
                    Admin
                  </button>
                  {/* Admin dropdown menu content */}
                  <div className={styles.navDropdownMenu}>
                    {/* Link to admin products page */}
                    <NavLink
                      to="/admin/products"
                      className={`${styles.linkBase} ${styles.navDropdownLink}`}
                      // Close menu when link is clicked
                      onClick={() => setOpenMenu(null)}
                    >
                      Manage Products
                    </NavLink>
                    {/* Link to admin orders page */}
                    <NavLink
                      to="/admin/orders"
                      className={`${styles.linkBase} ${styles.navDropdownLink}`}
                      // Close menu when link is clicked
                      onClick={() => setOpenMenu(null)}
                    >
                      All Orders
                    </NavLink>
                  </div>
                </div>
              )}
              {/* User dropdown menu (shown for all logged-in users) */}
              <div
                className={`${styles.navDropdown}${openMenu === 'user' ? ` ${styles.open}` : ''}`}
                ref={userRef}
              >
                {/* User dropdown toggle button (shows user's name) */}
                <button
                  className={`${styles.buttonBase} ${styles.btn} ${styles.btnGhost} ${styles.navDropdownToggle}`}
                  type="button"
                  // Accessibility: indicate if dropdown is expanded
                  aria-expanded={openMenu === 'user'}
                  // Toggle user menu open/closed
                  onClick={() =>
                    setOpenMenu((current) => (current === 'user' ? null : 'user'))
                  }
                >
                  {user.name}
                </button>
                {/* User dropdown menu content */}
                <div className={styles.navDropdownMenu}>
                  {/* Display user's email address */}
                  <span className={styles.navMeta}>Signed in as</span>
                  <span className={styles.navUser}>{user.email}</span>
                  {/* Logout button */}
                  <button
                    className={`${styles.buttonBase} ${styles.btn} ${styles.btnSecondary} ${styles.btnBlock}`}
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Authentication buttons (shown if user is not logged in)
            <div className={styles.navAuth}>
              {/* Login link button */}
              <NavLink
                to="/login"
                className={`${styles.linkBase} ${styles.btn} ${styles.btnGhost}`}
              >
                Login
              </NavLink>
              {/* Register link button */}
              <NavLink
                to="/register"
                className={`${styles.linkBase} ${styles.btn} ${styles.btnPrimary}`}
              >
                Create account
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
