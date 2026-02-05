// Import React and useEffect hook for side effects
import React, { useEffect } from 'react';
// Import React Router components: BrowserRouter for routing, Routes/Route for route definitions, useLocation for current route
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// Import AuthProvider to wrap app and provide authentication context globally
import { AuthProvider } from './context/AuthContext';
// Import layout components
import NavBar from './components/NavBar';
// Import ProtectedRoute component to guard routes that require authentication
import ProtectedRoute from './components/ProtectedRoute';
// Import page components for different routes
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CreateOrder from './pages/CreateOrder';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AIAssistant from './pages/AIAssistant';
import Footer from './components/Footer';
// Import CSS module styles for app layout
import styles from './styles/ui.module.css';

// ScrollToTop component automatically scrolls to top when route changes
// This provides better UX when navigating between pages
function ScrollToTop() {
  // Get current pathname from React Router's useLocation hook
  const { pathname } = useLocation();

  // useEffect runs whenever pathname changes (user navigates to new route)
  useEffect(() => {
    // Smoothly scroll window to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]); // Dependency array: re-run when pathname changes

  // This component doesn't render anything, it just performs side effect
  return null;
}

// Main App component: root component that sets up routing and layout
export default function App() {
  // useEffect to add global click handler for auto-scroll on button clicks
  useEffect(() => {
    // Event handler function that scrolls to top when buttons are clicked
    const handleGlobalButtonClick = (event) => {
      // Get the element that was clicked
      const target = event.target;
      // If target is not an Element, exit early (safety check)
      if (!(target instanceof Element)) return;
      // If clicked element or its parent has data-scroll-top="false", don't scroll
      // This allows specific buttons to opt-out of auto-scroll behavior
      if (target.closest('[data-scroll-top="false"]')) return;
      // If clicked element is a button or has button role, scroll to top
      if (target.closest('button, [role="button"]')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Add click event listener to entire document
    document.addEventListener('click', handleGlobalButtonClick);
    // Cleanup: remove event listener when component unmounts to prevent memory leaks
    return () => {
      document.removeEventListener('click', handleGlobalButtonClick);
    };
  }, []); // Empty dependency array: run only once on mount

  // Return JSX structure: AuthProvider wraps everything to provide auth context
  return (
    // AuthProvider makes authentication state available to all child components
    <AuthProvider>
      {/* BrowserRouter enables client-side routing (no page refreshes on navigation) */}
      <BrowserRouter>
        {/* ScrollToTop component handles scrolling when routes change */}
        <ScrollToTop />
        {/* Main app shell container with styling */}
        <div className={styles.appShell}>
          {/* Navigation bar component (always visible at top) */}
          <NavBar />
          {/* Main content area where page components render */}
          <main className={styles.mainContent}>
            {/* Routes component defines all possible routes in the application */}
            <Routes>
              {/* Public route: login page (no authentication required) */}
              <Route path="/login" element={<Login />} />
              {/* Public route: registration page (no authentication required) */}
              <Route path="/register" element={<Register />} />
              {/* Protected route: products listing page (requires authentication) */}
              <Route
                path="/"
                element={
                  // ProtectedRoute checks if user is logged in before showing Products
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              {/* Protected route: individual product detail page (requires authentication) */}
              {/* :id is a URL parameter that can be accessed in ProductDetail component */}
              <Route
                path="/products/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              {/* Protected route: create new order page (requires authentication) */}
              <Route
                path="/orders/create"
                element={
                  <ProtectedRoute>
                    <CreateOrder />
                  </ProtectedRoute>
                }
              />
              {/* Protected route: user's order history page (requires authentication) */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              {/* Protected route: individual order detail page (requires authentication) */}
              {/* :id is a URL parameter for the order ID */}
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              {/* Admin-only route: product management page (requires admin role) */}
              {/* requireRole="admin" restricts access to users with admin role */}
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute requireRole="admin">
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              {/* Admin-only route: all orders management page (requires admin role) */}
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute requireRole="admin">
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />
              {/* Protected route: AI assistant page (requires authentication) */}
              <Route
                path="/ai-assistant"
                element={
                  <ProtectedRoute>
                    <AIAssistant />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          {/* Footer component (always visible at bottom) */}
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
