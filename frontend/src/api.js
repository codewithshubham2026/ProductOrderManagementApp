// Import axios library for making HTTP requests
import axios from 'axios';

// Create a configured axios instance with base URL and default headers
// This instance will be used for all API calls throughout the application
const api = axios.create({
  // Use environment variable for API base URL, fallback to localhost:5000 if not set
  // VITE_ prefix is required for Vite to expose environment variables to the client
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
  // Set default headers for all requests to indicate JSON content type
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: runs before every API request is sent
// Automatically adds authentication token to request headers if available
api.interceptors.request.use((config) => {
  // Retrieve JWT token from browser's localStorage
  const token = localStorage.getItem('token');
  // If token exists, add it to the Authorization header in Bearer format
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Return the modified config so the request proceeds with the token
  return config;
});

// Response interceptor: handles responses and errors from API calls
// First function handles successful responses (passes them through unchanged)
// Second function handles errors (catches 401 unauthorized errors)
api.interceptors.response.use(
  // Success handler: simply return the response as-is
  (response) => response,
  // Error handler: check if error is 401 (unauthorized/expired token)
  (error) => {
    // Check if the error response status is 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Remove expired/invalid token from localStorage
      localStorage.removeItem('token');
      // Redirect user to login page to re-authenticate
      window.location.href = '/login';
    }
    // Reject the promise so components can handle the error if needed
    return Promise.reject(error);
  }
);

// Export the configured axios instance as default export
// This allows other files to import and use it for API calls
export default api;
