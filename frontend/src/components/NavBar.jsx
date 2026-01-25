import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/ui.module.css';
import Logo from './Logo';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState(null);
  const adminRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const inAdmin = adminRef.current?.contains(event.target);
      const inUser = userRef.current?.contains(event.target);
      if (!inAdmin && !inUser) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.container} ${styles.navbarInner}`}>
        <NavLink to="/" className={`${styles.linkBase} ${styles.navbarBrand}`}>
          <Logo className={styles.brandIcon} size={32} />
          <span>Proget Kart</span>
        </NavLink>
        <div className={styles.navbarLinks}>
          {user && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${styles.linkBase} ${styles.navLink}${isActive ? ` ${styles.active}` : ''}`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `${styles.linkBase} ${styles.navLink}${isActive ? ` ${styles.active}` : ''}`
                }
              >
                My Orders
              </NavLink>
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
        <div className={styles.navbarActions}>
          {user ? (
            <>
              {user.role === 'admin' && (
                <div
                  className={`${styles.navDropdown}${openMenu === 'admin' ? ` ${styles.open}` : ''}`}
                  ref={adminRef}
                >
                  <button
                    className={`${styles.buttonBase} ${styles.btn} ${styles.btnGhost} ${styles.navDropdownToggle}`}
                    type="button"
                    aria-expanded={openMenu === 'admin'}
                    onClick={() =>
                      setOpenMenu((current) => (current === 'admin' ? null : 'admin'))
                    }
                  >
                    Admin
                  </button>
                  <div className={styles.navDropdownMenu}>
                    <NavLink
                      to="/admin/products"
                      className={`${styles.linkBase} ${styles.navDropdownLink}`}
                      onClick={() => setOpenMenu(null)}
                    >
                      Manage Products
                    </NavLink>
                    <NavLink
                      to="/admin/orders"
                      className={`${styles.linkBase} ${styles.navDropdownLink}`}
                      onClick={() => setOpenMenu(null)}
                    >
                      All Orders
                    </NavLink>
                  </div>
                </div>
              )}
              <div
                className={`${styles.navDropdown}${openMenu === 'user' ? ` ${styles.open}` : ''}`}
                ref={userRef}
              >
                <button
                  className={`${styles.buttonBase} ${styles.btn} ${styles.btnGhost} ${styles.navDropdownToggle}`}
                  type="button"
                  aria-expanded={openMenu === 'user'}
                  onClick={() =>
                    setOpenMenu((current) => (current === 'user' ? null : 'user'))
                  }
                >
                  {user.name}
                </button>
                <div className={styles.navDropdownMenu}>
                  <span className={styles.navMeta}>Signed in as</span>
                  <span className={styles.navUser}>{user.email}</span>
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
            <div className={styles.navAuth}>
              <NavLink
                to="/login"
                className={`${styles.linkBase} ${styles.btn} ${styles.btnGhost}`}
              >
                Login
              </NavLink>
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
