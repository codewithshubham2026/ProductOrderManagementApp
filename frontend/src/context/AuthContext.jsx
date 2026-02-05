// Import React hooks: createContext for context API, useEffect for side effects, useState for state
import React, { createContext, useEffect, useState } from 'react';
// Import the configured axios instance for API calls
import api from '../api';

// Create and export AuthContext so components can access authentication state
// null is the default value if component is used outside AuthProvider
export const AuthContext = createContext(null);

// AuthProvider component wraps the entire app and provides authentication state globally
// children prop represents all child components that will have access to auth context
export function AuthProvider({ children }) {
  // State to store the currently logged-in user object (null if not logged in)
  const [user, setUser] = useState(null);
  // State to track if we're still checking authentication status (prevents flash of login page)
  const [loading, setLoading] = useState(true);

  // useEffect runs once when component mounts (empty dependency array [])
  // This checks if user is already logged in when app first loads
  useEffect(() => {
    // Async function to fetch current user data from backend
    async function fetchMe() {
      // Check if authentication token exists in browser's localStorage
      const token = localStorage.getItem('token');
      // If no token exists, user is not logged in, stop loading
      if (!token) {
        setLoading(false);
        return;
      }
      // If token exists, verify it's valid by calling backend
      try {
        // Make API call to get current user info (token is automatically added by interceptor)
        const { data } = await api.get('/api/auth/me');
        // If successful, set the user state with the returned user data
        setUser(data.user);
      } catch (error) {
        // If token is invalid/expired, remove it from localStorage
        localStorage.removeItem('token');
      } finally {
        // Always set loading to false after check completes (success or failure)
        setLoading(false);
      }
    }
    // Call the async function to check authentication status
    fetchMe();
  }, []); // Empty dependency array means this runs only once on mount

  // Function to log in a user: saves token and sets user state
  const login = (token, userData) => {
    // Save JWT token to localStorage so it persists across page refreshes
    localStorage.setItem('token', token);
    // Update user state with the logged-in user's data
    setUser(userData);
  };

  // Function to log out a user: removes token and clears user state
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Clear user state (set to null)
    setUser(null);
  };

  // Return the context provider with auth state and functions
  // value prop contains everything that child components can access via useContext
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
