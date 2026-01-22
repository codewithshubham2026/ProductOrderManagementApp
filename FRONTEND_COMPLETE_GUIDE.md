# Frontend Project Complete Flow & Teaching Guide
## Product & Order Management System

## Table of Contents
1. [Project Architecture Overview](#project-architecture-overview)
2. [File Structure & Logic Flow](#file-structure--logic-flow)
3. [Complete Component Breakdown](#complete-component-breakdown)
4. [User Flows & Interactions](#user-flows--interactions)
5. [API Integration & State Management](#api-integration--state-management)
6. [Routing & Navigation](#routing--navigation)
7. [Styling & UI Components](#styling--ui-components)
8. [Testing Guide](#testing-guide)
9. [Common Issues & Solutions](#common-issues--solutions)

---

## Project Architecture Overview

### Technology Stack
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.2.0
- **Routing**: React Router DOM 6.22.3
- **HTTP Client**: Axios 1.6.8
- **Styling**: Custom CSS

### Architecture Pattern
- **Component-Based**: Reusable, isolated components
- **Context API**: Global state management (authentication)
- **Protected Routes**: Route guards for authentication/authorization
- **API Layer**: Centralized API configuration with interceptors

### Key Concepts for Students
1. **React Hooks**: useState, useEffect, useContext
2. **React Router**: Navigation, protected routes, URL parameters
3. **Context API**: Global state sharing
4. **Axios Interceptors**: Request/response handling
5. **Form Handling**: Controlled components, complex forms
6. **Error Handling**: User-friendly error messages
7. **Pagination**: Client-side pagination controls

---

## File Structure & Logic Flow

### Complete File Structure

```
frontend/
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite build configuration
├── env.example               # Environment variables template
├── index.html                # HTML entry point
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Main app component (routing)
    ├── api.js                # Axios configuration
    ├── styles.css            # Global styles
    ├── context/
    │   └── AuthContext.jsx   # Authentication context provider
    ├── components/
    │   ├── NavBar.jsx        # Navigation bar
    │   ├── ProtectedRoute.jsx # Route guard component
    │   ├── ProductCard.jsx   # Product display card
    │   └── OrderCard.jsx     # Order display card
    └── pages/
        ├── Login.jsx         # Login page
        ├── Register.jsx     # Registration page
        ├── Products.jsx     # Product listing with search/filter
        ├── ProductDetail.jsx # Single product view
        ├── CreateOrder.jsx  # Order creation page
        ├── Orders.jsx        # User order history
        ├── OrderDetail.jsx  # Single order view
        ├── AdminProducts.jsx # Admin product management
        ├── AdminOrders.jsx  # Admin order management
        └── AIAssistant.jsx  # AI product assistant
```

---

## Complete Component Breakdown

### 1. Entry Point: `src/main.jsx`

**Purpose**: React application bootstrap

**Code Flow**:
```javascript
1. Import React and ReactDOM
2. Import App component
3. Get root element from DOM
4. Render App inside React.StrictMode
5. StrictMode helps catch bugs in development
```

---

### 2. API Configuration: `src/api.js`

**Purpose**: Centralized HTTP client setup with interceptors

**Logic Flow**:
```
1. Create Axios instance with base URL from environment
2. Request Interceptor:
   - Check localStorage for token
   - Attach token to Authorization header
   - Format: "Bearer <token>"
3. Response Interceptor:
   - Handle 401 errors (unauthorized)
   - Clear token and redirect to login
   - Pass through other errors
```

**Key Features**:
- **Base URL**: Reads from `VITE_API_URL` environment variable
- **Auto Token**: Automatically adds JWT to all requests
- **Auto Logout**: Redirects to login on 401 errors

**Environment Variable**:
```env
VITE_API_URL=http://localhost:5000
```

---

### 3. Authentication Context: `src/context/AuthContext.jsx`

**Purpose**: Global authentication state management

**State Variables**:
- `user`: Current logged-in user object (null if not logged in)
- `loading`: Boolean indicating if auth check is in progress

**Functions Provided**:
- `login(token, userData)`: Store token and set user
- `logout()`: Clear token and reset user

**Logic Flow**:
```
1. On Component Mount (useEffect):
   - Check localStorage for token
   - If token exists:
     - Call /api/auth/me endpoint
     - If successful: Set user state
     - If failed: Remove invalid token
   - Set loading to false
2. Login Function:
   - Save token to localStorage
   - Update user state
3. Logout Function:
   - Remove token from localStorage
   - Clear user state
```

---

### 4. Main App Component: `src/App.jsx`

**Purpose**: Application shell with routing

**Structure**:
```
AuthProvider (Context Provider)
  └── BrowserRouter (React Router)
      └── NavBar (Navigation)
      └── Routes (Route definitions)
          ├── / → Products (Protected)
          ├── /products/:id → ProductDetail (Protected)
          ├── /orders/create → CreateOrder (Protected)
          ├── /orders → Orders (Protected)
          ├── /orders/:id → OrderDetail (Protected)
          ├── /admin/products → AdminProducts (Protected, Admin only)
          ├── /admin/orders → AdminOrders (Protected, Admin only)
          ├── /ai-assistant → AIAssistant (Protected)
          ├── /login → Login (Public)
          └── /register → Register (Public)
```

**Route Protection**:
- `/`, `/products/:id`, `/orders/*`, `/ai-assistant`: Protected (requires authentication)
- `/admin/*`: Protected + Role check (requires admin role)
- `/login`, `/register`: Public routes

---

### 5. Navigation Bar: `src/components/NavBar.jsx`

**Purpose**: Site-wide navigation

**Logic Flow**:
```
1. Get user and logout function from AuthContext
2. Render navigation links based on user state:
   - If user exists:
     - Show "Products" link
     - Show "My Orders" link
     - Show "AI Assistant" link
     - If admin: Show "Manage Products" and "All Orders" links
     - Show welcome message with name
     - Show logout button
   - If no user:
     - Show "Login" and "Register" links
3. Handle logout on button click
```

**Features**:
- Dynamic navigation based on auth state
- Role-based link visibility
- User information display
- Logout functionality

---

### 6. Protected Route Component: `src/components/ProtectedRoute.jsx`

**Purpose**: Route guard for authentication and authorization

**Logic Flow**:
```
1. Get user and loading from AuthContext
2. If loading: Show loading message
3. If no user: Redirect to /login
4. If requireRole is set:
   - Check if user.role matches requireRole
   - If not: Redirect to home (/)
5. If all checks pass: Render children
```

**Usage Examples**:
```javascript
// Protected route (any authenticated user)
<ProtectedRoute>
  <Products />
</ProtectedRoute>

// Admin-only route
<ProtectedRoute requireRole="admin">
  <AdminProducts />
</ProtectedRoute>
```

---

### 7. Product Card Component: `src/components/ProductCard.jsx`

**Purpose**: Display product information in card format

**Props**:
- `product`: Product object with name, price, description, etc.

**Features**:
- Product image display
- Category badge
- Price display
- Description preview
- Link to product detail page

---

### 8. Order Card Component: `src/components/OrderCard.jsx`

**Purpose**: Display order information

**Props**:
- `order`: Order object with items, total, status, etc.

**Features**:
- Order ID display
- Status badge with color coding
- Total amount
- Item count
- Date display
- Link to order detail page

---

### 9. Login Page: `src/pages/Login.jsx`

**Purpose**: User authentication

**State Management**:
- `email`: Email input
- `password`: Password input
- `error`: Error message string
- `loading`: Loading state boolean

**Logic Flow**:
```
1. User enters email and password
2. On form submit:
   - Prevent default form submission
   - Clear previous errors
   - Set loading to true
   - Call POST /api/auth/login
   - On success:
     - Call login(token, user) from context
     - Navigate to / (Products page)
   - On error:
     - Display error message
   - Set loading to false
```

**Features**:
- Controlled form inputs
- Loading state
- Error message display
- Link to registration page

---

### 10. Register Page: `src/pages/Register.jsx`

**Purpose**: New user registration

**State Management**:
- `name`: Name input
- `email`: Email input
- `password`: Password input
- `error`: Error message string
- `loading`: Loading state boolean

**Logic Flow**:
```
1. User enters name, email, and password
2. On form submit:
   - Prevent default form submission
   - Clear previous errors
   - Set loading to true
   - Call POST /api/auth/register
   - On success:
     - Call login(token, user) from context
     - Navigate to / (Products page)
   - On error:
     - Display error message
   - Set loading to false
```

---

### 11. Products Page: `src/pages/Products.jsx`

**Purpose**: Product listing with search, filter, and pagination

**State Management**:
- `products`: Array of products
- `categories`: Array of all categories
- `search`: Search query string
- `selectedCategory`: Selected category filter
- `page`: Current page number
- `pagination`: Pagination metadata
- `loading`: Loading state
- `error`: Error message

**Logic Flow**:
```
1. On component mount:
   - Fetch all categories
   - Fetch products with default params
2. On search/filter change:
   - Reset page to 1
   - Fetch products with new params
3. On page change:
   - Fetch products for new page
4. Display products in grid
5. Display pagination controls
```

**Features**:
- Real-time search
- Category filtering
- Pagination
- Loading states
- Error handling
- Product grid layout

---

### 12. Product Detail Page: `src/pages/ProductDetail.jsx`

**Purpose**: Display full product information and add to order

**State Management**:
- `product`: Product object
- `quantity`: Selected quantity
- `loading`: Loading state
- `error`: Error message

**Logic Flow**:
```
1. On component mount:
   - Extract product ID from URL params
   - Fetch product details
2. Display product information
3. Allow quantity selection
4. On "Add to Order" click:
   - Navigate to /orders/create with product data
```

**Features**:
- Product image display
- Full description
- Price and stock information
- Quantity selector
- Add to order button
- Stock availability check

---

### 13. Create Order Page: `src/pages/CreateOrder.jsx`

**Purpose**: Create new order with multiple products

**State Management**:
- `cart`: Array of cart items { productId, quantity }
- `products`: Object mapping productId to product data
- `shippingAddress`: Address form data
- `loading`: Loading state
- `error`: Error message

**Logic Flow**:
```
1. On component mount:
   - Check if coming from product detail (location.state)
   - If yes: Add product to cart
2. Cart Management:
   - Add product: Fetch product, add to cart
   - Update quantity: Update cart item
   - Remove product: Remove from cart
3. Calculate total from cart items
4. On form submit:
   - Validate shipping address
   - Call POST /api/orders with items and address
   - On success: Navigate to order detail page
   - On error: Display error message
```

**Features**:
- Shopping cart functionality
- Multiple product support
- Quantity management
- Shipping address form
- Total calculation
- Stock validation

---

### 14. Orders Page: `src/pages/Orders.jsx`

**Purpose**: Display user's order history

**State Management**:
- `orders`: Array of orders
- `pagination`: Pagination metadata
- `page`: Current page number
- `loading`: Loading state
- `error`: Error message

**Logic Flow**:
```
1. On component mount:
   - Fetch user's orders
2. On page change:
   - Fetch orders for new page
3. Display orders in list
4. Display pagination controls
```

**Features**:
- Order list display
- Pagination
- Order status badges
- Link to order details

---

### 15. Order Detail Page: `src/pages/OrderDetail.jsx`

**Purpose**: Display complete order information

**State Management**:
- `order`: Order object with populated items
- `loading`: Loading state
- `error`: Error message

**Logic Flow**:
```
1. On component mount:
   - Extract order ID from URL params
   - Fetch order details
2. Display order information:
   - Order items with product details
   - Total amount
   - Shipping address
   - Order status
   - Order date
```

**Features**:
- Complete order information
- Itemized list
- Status display
- Shipping address
- Date and time

---

### 16. Admin Products Page: `src/pages/AdminProducts.jsx`

**Purpose**: Admin product management (CRUD operations)

**State Management**:
- `products`: Array of all products
- `showForm`: Boolean to show/hide form
- `editingProduct`: Product being edited (null if creating new)
- `formData`: Form input data
- `loading`: Loading state
- `error`: Error message
- `success`: Success message

**Logic Flow**:
```
1. On component mount:
   - Fetch all products
2. Form Management:
   - Toggle form visibility
   - Populate form when editing
   - Clear form when creating new
3. On form submit:
   - If editing: PUT /api/products/:id
   - If creating: POST /api/products
   - Refresh product list
4. Delete Product:
   - Confirm deletion
   - DELETE /api/products/:id
   - Refresh product list
```

**Features**:
- Product list display
- Create product form
- Edit product form
- Delete product with confirmation
- Success/error messages
- Product grid layout

---

### 17. Admin Orders Page: `src/pages/AdminOrders.jsx`

**Purpose**: Admin order management and status updates

**State Management**:
- `orders`: Array of all orders
- `pagination`: Pagination metadata
- `page`: Current page number
- `statusFilter`: Selected status filter
- `loading`: Loading state
- `error`: Error message

**Logic Flow**:
```
1. On component mount:
   - Fetch all orders
2. On filter change:
   - Reset page to 1
   - Fetch filtered orders
3. On status update:
   - PUT /api/orders/:id/status
   - Refresh order list
```

**Features**:
- All orders display
- Status filtering
- Status update dropdown
- Customer information
- Order details
- Pagination

---

### 18. AI Assistant Page: `src/pages/AIAssistant.jsx`

**Purpose**: AI-powered product assistant

**State Management**:
- `question`: User question input
- `productId`: Selected product ID (optional)
- `products`: Array of all products (for dropdown)
- `response`: AI response text
- `loading`: Loading state
- `error`: Error message

**Logic Flow**:
```
1. On component mount:
   - Fetch all products for dropdown
2. On form submit:
   - Validate question is not empty
   - Call POST /api/ai/ask with question and productId
   - Display AI response
   - Clear question input
```

**Features**:
- Product selection dropdown
- Question input
- AI response display
- Loading states
- Error handling
- Optional product context

---

## User Flows & Interactions

### Flow 1: New User Registration & Product Browsing

```
1. User visits /register
2. Fills out registration form
3. Submits form
4. Frontend calls POST /api/auth/register
5. Backend creates user, returns token
6. Frontend stores token, updates AuthContext
7. Navigate to / (Products page)
8. User browses products
9. User can search and filter products
10. User clicks on product to view details
```

### Flow 2: Product Search & Order Creation

```
1. User on Products page
2. Enters search query
3. Frontend calls GET /api/products?search=query
4. Backend returns filtered products
5. Frontend displays results
6. User clicks "View Details" on product
7. Navigate to /products/:id
8. User selects quantity
9. User clicks "Add to Order"
10. Navigate to /orders/create with product data
11. User adds more products or fills shipping address
12. User submits order
13. Frontend calls POST /api/orders
14. Backend creates order, updates stock
15. Navigate to /orders/:id (order detail)
```

### Flow 3: Order Management (User)

```
1. User clicks "My Orders" in NavBar
2. Navigate to /orders
3. Frontend calls GET /api/orders/my-orders
4. Backend returns user's orders
5. Frontend displays order list
6. User clicks on order
7. Navigate to /orders/:id
8. Frontend calls GET /api/orders/:id
9. Backend returns order details
10. Frontend displays complete order information
```

### Flow 4: Admin Product Management

```
1. Admin clicks "Manage Products" in NavBar
2. Navigate to /admin/products
3. Frontend calls GET /api/products
4. Backend returns all products
5. Frontend displays product grid
6. Admin clicks "Add New Product"
7. Admin fills product form
8. Admin submits form
9. Frontend calls POST /api/products
10. Backend creates product
11. Frontend refreshes product list
12. Admin can edit or delete products
```

### Flow 5: Admin Order Management

```
1. Admin clicks "All Orders" in NavBar
2. Navigate to /admin/orders
3. Frontend calls GET /api/orders/admin/all
4. Backend returns all orders
5. Frontend displays order list
6. Admin selects status filter
7. Frontend calls GET /api/orders/admin/all?status=filter
8. Backend returns filtered orders
9. Admin updates order status
10. Frontend calls PUT /api/orders/:id/status
11. Backend updates order status
12. Frontend refreshes order list
```

### Flow 6: AI Assistant Usage

```
1. User clicks "AI Assistant" in NavBar
2. Navigate to /ai-assistant
3. User optionally selects a product
4. User types question
5. User clicks "Ask Question"
6. Frontend calls POST /api/ai/ask
7. Backend calls Gemini API with question and product context
8. Backend returns AI response
9. Frontend displays response
10. User can ask more questions
```

---

## API Integration & State Management

### API Calls Overview

| Endpoint | Method | Auth Required | Purpose |
|----------|--------|---------------|---------|
| `/api/auth/register` | POST | No | Create new user |
| `/api/auth/login` | POST | No | Authenticate user |
| `/api/auth/me` | GET | Yes | Get current user |
| `/api/products` | GET | No | Get all products |
| `/api/products/categories` | GET | No | Get categories |
| `/api/products/:id` | GET | No | Get single product |
| `/api/products` | POST | Admin | Create product |
| `/api/products/:id` | PUT | Admin | Update product |
| `/api/products/:id` | DELETE | Admin | Delete product |
| `/api/orders` | POST | Yes | Create order |
| `/api/orders/my-orders` | GET | Yes | Get user orders |
| `/api/orders/:id` | GET | Yes | Get order details |
| `/api/orders/admin/all` | GET | Admin | Get all orders |
| `/api/orders/:id/status` | PUT | Admin | Update order status |
| `/api/ai/ask` | POST | Yes | Ask AI question |

### State Management Strategy

**Global State (Context API)**:
- User authentication state
- Login/logout functions
- Loading state for auth check

**Local State (useState)**:
- Form inputs
- Error messages
- Loading states
- Component-specific data (products, orders, cart)

**Why This Approach**:
- Context for shared, global state
- Local state for component-specific data
- Simple and easy to understand
- No external state management library needed

---

## Routing & Navigation

### Route Configuration

```javascript
/ → Products (Protected)
/products/:id → ProductDetail (Protected)
/orders/create → CreateOrder (Protected)
/orders → Orders (Protected)
/orders/:id → OrderDetail (Protected)
/admin/products → AdminProducts (Protected, Admin only)
/admin/orders → AdminOrders (Protected, Admin only)
/ai-assistant → AIAssistant (Protected)
/login → Login (Public)
/register → Register (Public)
```

### Navigation Flow

**Public Routes**:
- Accessible without authentication
- Login and Register pages
- Redirect to products if already logged in

**Protected Routes**:
- Require authentication
- Redirect to /login if not authenticated
- Products, Orders, AI Assistant accessible to all authenticated users

**Admin Routes**:
- Require authentication + admin role
- Redirect to / if not admin
- Admin panels for product and order management

---

## Styling & UI Components

### Styling Approach

**Global CSS**:
- `styles.css`: Base styles, CSS variables, utility classes
- Consistent color scheme
- Responsive design
- Card layouts
- Form styles
- Button styles

### UI Patterns

**Loading States**:
- Loading text
- Disabled buttons
- Prevents duplicate submissions

**Error Handling**:
- Inline error messages
- Alert containers
- User-friendly messages
- Network error detection

**Success Feedback**:
- Success messages
- Visual confirmation
- State updates

**Status Badges**:
- Color-coded status indicators
- Order status badges
- Role badges

---

## Testing Guide

### Manual Testing Checklist

#### Authentication Flow
- [ ] Register new user
- [ ] Register with duplicate email (error)
- [ ] Register with invalid email (error)
- [ ] Register with short password (error)
- [ ] Login with correct credentials
- [ ] Login with wrong password (error)
- [ ] Login with non-existent email (error)
- [ ] Logout functionality
- [ ] Session persistence (refresh page)

#### Product Browsing
- [ ] View all products
- [ ] Search products
- [ ] Filter by category
- [ ] Pagination navigation
- [ ] View product details
- [ ] Add product to order

#### Order Management
- [ ] Create order with single product
- [ ] Create order with multiple products
- [ ] Create order with insufficient stock (error)
- [ ] View order history
- [ ] View order details
- [ ] Pagination in order list

#### Admin Features
- [ ] View all products (admin)
- [ ] Create new product
- [ ] Edit product
- [ ] Delete product
- [ ] View all orders (admin)
- [ ] Filter orders by status
- [ ] Update order status

#### AI Assistant
- [ ] Ask general question
- [ ] Ask question with product context
- [ ] View AI response
- [ ] Handle AI errors

#### Navigation
- [ ] NavBar shows correct links for logged-out user
- [ ] NavBar shows correct links for logged-in user
- [ ] NavBar shows admin links for admin users
- [ ] Navigation links work correctly
- [ ] Logout button works
- [ ] Protected routes redirect correctly

---

## Common Issues & Solutions

### Issue 1: CORS Errors

**Symptoms**: 
- Network errors in console
- "CORS policy" error messages
- Requests blocked by browser

**Solution**:
1. Check `VITE_API_URL` in frontend `.env`
2. Check `CLIENT_ORIGIN` in backend `.env`
3. Ensure `CLIENT_ORIGIN` matches frontend URL exactly
4. No trailing slashes
5. Restart both servers

### Issue 2: Token Not Persisting

**Symptoms**:
- Logged out after page refresh
- Token not in localStorage

**Solution**:
1. Check browser localStorage (DevTools → Application → Local Storage)
2. Verify token is being saved in login/register
3. Check AuthContext useEffect is running
4. Verify `/api/auth/me` endpoint works

### Issue 3: API Calls Failing

**Symptoms**:
- Network errors
- 404 errors
- Connection refused

**Solution**:
1. Verify backend is running
2. Check backend port (default: 5000)
3. Test backend health: `http://localhost:5000/api/health`
4. Check `VITE_API_URL` matches backend URL
5. Verify no trailing slash in base URL

### Issue 4: Protected Routes Not Working

**Symptoms**:
- Can access protected routes without login
- Redirects not working

**Solution**:
1. Check ProtectedRoute component logic
2. Verify AuthContext is providing data
3. Check token is being sent in requests
4. Verify backend authentication middleware

### Issue 5: Search/Filter Not Working

**Symptoms**:
- Search doesn't return results
- Filter doesn't work

**Solution**:
1. Check query parameters are being sent correctly
2. Verify backend search/filter logic
3. Check API response format
4. Verify pagination is working

### Issue 6: Order Creation Fails

**Symptoms**:
- Order not created
- Stock errors

**Solution**:
1. Check cart items are formatted correctly
2. Verify shipping address is complete
3. Check product stock availability
4. Verify backend order creation logic

---

## Quick Reference

### Environment Variables

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:5000
```

**Important**: 
- Must start with `VITE_`
- Access with `import.meta.env.VITE_API_URL`
- No trailing slash

### Default URLs

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **API Base**: `http://localhost:5000/api`

### Key Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Component Import Pattern

```javascript
// Context
import { AuthContext } from './context/AuthContext';

// API
import api from './api';

// Components
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import ProductCard from './components/ProductCard';

// Pages
import Products from './pages/Products';
import Login from './pages/Login';
```

### Common Patterns

**Form Handling**:
```javascript
const [form, setForm] = useState({ email: '', password: '' });

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Submit logic
};
```

**API Call Pattern**:
```javascript
try {
  setLoading(true);
  const { data } = await api.post('/api/endpoint', payload);
  // Handle success
} catch (err) {
  setError(err.response?.data?.message || 'Error message');
} finally {
  setLoading(false);
}
```

**Pagination Pattern**:
```javascript
const [page, setPage] = useState(1);

useEffect(() => {
  fetchData(page);
}, [page]);

const fetchData = async (pageNum) => {
  const { data } = await api.get('/api/endpoint', {
    params: { page: pageNum, limit: 10 }
  });
  setData(data.items);
  setPagination(data.pagination);
};
```

---

## Teaching Timeline (2 Hours)

### Hour 1: Foundation & Core Concepts (60 minutes)

**0-10 min: Introduction**
- Project overview
- Technology stack
- File structure walkthrough
- Architecture overview

**10-25 min: Setup & Configuration**
- Environment variables
- API configuration (api.js)
- Axios interceptors
- Base URL setup

**25-45 min: Authentication System**
- AuthContext setup
- Login flow
- Register flow
- Token management
- Session persistence

**45-60 min: Routing & Navigation**
- React Router setup
- Route configuration
- ProtectedRoute component
- Navigation bar
- Route guards

### Hour 2: Features & Advanced Topics (60 minutes)

**0-20 min: Product Browsing**
- Products page
- Search and filter
- Pagination
- Product detail page

**20-40 min: Order Management**
- Create order page
- Order history
- Order details
- Cart functionality

**40-55 min: Admin Features**
- Admin product management
- Admin order management
- AI assistant
- Role-based access

**55-60 min: Q&A & Best Practices**
- Common issues
- Debugging tips
- Best practices
- Next steps

---

## Key Learning Objectives

By the end of this guide, students should understand:

1. **React Fundamentals**:
   - Component structure
   - Hooks (useState, useEffect, useContext)
   - Props and state management
   - Event handling

2. **Routing**:
   - React Router setup
   - Route protection
   - Navigation patterns
   - URL parameters

3. **State Management**:
   - Context API
   - Global vs local state
   - State updates
   - Persistence (localStorage)

4. **API Integration**:
   - Axios configuration
   - Request/response interceptors
   - Error handling
   - Loading states

5. **Form Handling**:
   - Controlled components
   - Complex forms
   - Form submission
   - Validation

6. **UI/UX Patterns**:
   - Loading states
   - Error messages
   - Success feedback
   - Pagination
   - Search and filter

7. **Best Practices**:
   - Component organization
   - Code reusability
   - Error handling
   - User experience

---

## File Creation Order (Development)

1. `package.json` - Dependencies
2. `vite.config.js` - Build configuration
3. `index.html` - HTML entry point
4. `src/main.jsx` - React entry point
5. `src/api.js` - API configuration
6. `src/context/AuthContext.jsx` - Auth context
7. `src/styles.css` - Global styles
8. `src/components/ProtectedRoute.jsx` - Route guard
9. `src/components/NavBar.jsx` - Navigation
10. `src/pages/Login.jsx` - Login page
11. `src/pages/Register.jsx` - Register page
12. `src/pages/Products.jsx` - Products page
13. `src/pages/ProductDetail.jsx` - Product detail
14. `src/pages/CreateOrder.jsx` - Create order
15. `src/pages/Orders.jsx` - Orders page
16. `src/pages/OrderDetail.jsx` - Order detail
17. `src/App.jsx` - Main app with routing
18. `src/pages/AdminProducts.jsx` - Admin products
19. `src/pages/AdminOrders.jsx` - Admin orders
20. `src/pages/AIAssistant.jsx` - AI assistant
21. `src/components/ProductCard.jsx` - Product card
22. `src/components/OrderCard.jsx` - Order card

---

## Additional Resources

### React Documentation
- [React Official Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Context API Guide](https://react.dev/reference/react/useContext)

### Vite Documentation
- [Vite Guide](https://vitejs.dev/guide/)
- [Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

### Axios Documentation
- [Axios Docs](https://axios-http.com/docs/intro)
- [Interceptors](https://axios-http.com/docs/interceptors)

---

**End of Document**
