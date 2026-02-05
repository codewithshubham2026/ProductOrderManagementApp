# Frontend Code Teaching Guide
## 3-Hour Recording Session Plan

This guide provides a comprehensive explanation of the frontend codebase for teaching purposes. Each section is designed to be covered in detail during a 3-hour recording session.

---

## Table of Contents

1. [Development Steps: Building the Frontend](#development-steps-building-the-frontend)
2. [Session 1: Project Setup & Core Architecture (45 minutes)](#session-1-project-setup--core-architecture-45-minutes)
3. [Session 2: Authentication & Routing (45 minutes)](#session-2-authentication--routing-45-minutes)
4. [Session 3: Components & Pages (45 minutes)](#session-3-components--pages-45-minutes)
5. [Session 4: Advanced Features & API Integration (45 minutes)](#session-4-advanced-features--api-integration-45-minutes)

---

## Development Steps: Building the Frontend

This section outlines the step-by-step development process for building this frontend application.

### Phase 1: Project Setup & Foundation

**Step 1: Initialize React Project**
- Create Vite + React project
- Install dependencies: React, React Router DOM, Axios
- Set up project structure (src/, components/, pages/, context/, styles/)

**Step 2: Configure API Client (`api.js`)**
- Install and import Axios
- Create axios instance with base URL from environment variable
- Set default headers (Content-Type: application/json)
- Add request interceptor to inject authentication token
- Add response interceptor to handle 401 errors (clear token, redirect to login)
- Export the configured instance

**Step 3: Create Entry Point (`main.jsx`)**
- Import React and ReactDOM
- Import App component
- Import global CSS module
- Use ReactDOM.createRoot to render App in StrictMode
- Mount to root element in index.html

**Step 4: Set Up Authentication Context (`context/AuthContext.jsx`)**
- Create AuthContext using createContext
- Create AuthProvider component
- Add state: user, loading
- Add useEffect to check token on mount (call /api/auth/me)
- Add login function (save token, set user)
- Add logout function (remove token, clear user)
- Export context and provider

**Step 5: Create App Structure (`App.jsx`)**
- Wrap app with AuthProvider
- Add BrowserRouter for routing
- Create ScrollToTop component (scrolls on route change)
- Add global button click handler (auto-scroll)
- Set up layout: NavBar, main content area, Footer
- Define all routes (public and protected)

### Phase 2: Core Components

**Step 6: Create ProtectedRoute Component (`components/ProtectedRoute.jsx`)**
- Import useContext, Navigate from React Router
- Get user and loading from AuthContext
- Show loading indicator if auth is checking
- Redirect to /login if no user
- Check requireRole prop, redirect if insufficient
- Render children if all checks pass

**Step 7: Create Reusable UI Components**
- **Input.jsx**: forwardRef component with variant support, class composition
- **Select.jsx**: Custom dropdown with portal, keyboard navigation, accessibility
- **Logo.jsx**: SVG logo component with size prop
- **ProductCard.jsx**: Display product with image, price, stock status, link to detail
- **OrderCard.jsx**: Display order summary with status badge, totals, date

**Step 8: Create Layout Components**
- **NavBar.jsx**: 
  - Show logo and brand name
  - Conditional navigation links (only if logged in)
  - Admin dropdown (only if admin role)
  - User dropdown with logout
  - Login/Register buttons (if not logged in)
  - Click outside handler for dropdowns
- **Footer.jsx**: Brand, navigation links, social media icons, copyright

### Phase 3: Authentication Pages

**Step 9: Create Login Page (`pages/Login.jsx`)**
- Add state: email, password, showPassword, error, loading
- Get login function from AuthContext
- Create form with email and password inputs
- Add password visibility toggle
- Handle form submission: call /api/auth/login
- On success: call login() from context, navigate to home
- On error: display error message

**Step 10: Create Register Page (`pages/Register.jsx`)**
- Similar to Login but add name field
- Add password minLength validation
- Handle form submission: call /api/auth/register
- On success: auto-login and navigate to home

### Phase 4: Product Pages

**Step 11: Create Products Page (`pages/Products.jsx`)**
- Add state: products, categories, search, selectedCategory, sortBy, page, pagination, loading, error
- Fetch categories on mount
- Fetch products when search, category, or page changes
- Create search input handler (reset to page 1)
- Create category filter handler (reset to page 1)
- Implement client-side sorting with useMemo
- Create pagination controls
- Add filter reset functionality
- Display products in grid using ProductCard

**Step 12: Create Product Detail Page (`pages/ProductDetail.jsx`)**
- Get product ID from URL params (useParams)
- Add state: product, quantity, loading, error
- Fetch product by ID on mount
- Display product image, name, price, description, stock
- Add quantity input (max = stock)
- Add "Add to Order" button
- Navigate to /orders/create with product state

### Phase 5: Order Management

**Step 13: Create Create Order Page (`pages/CreateOrder.jsx`)**
- Add state: cart (array of {productId, quantity}), products (object map), shippingAddress, loading, error
- Use useRef to track if product was added from ProductDetail
- useEffect to add product from location.state if present
- Create addToCart function (fetch product, add to cart)
- Create removeFromCart function
- Create updateQuantity function
- Create calculateTotal function
- Display cart items with quantity controls
- Create shipping address form
- Handle form submission: POST /api/orders
- Navigate to order detail on success

**Step 14: Create Orders Page (`pages/Orders.jsx`)**
- Add state: orders, pagination, page, loading, error
- Fetch orders on mount and when page changes
- Use useMemo for pagination page numbers
- Display orders using OrderCard component
- Add pagination controls

**Step 15: Create Order Detail Page (`pages/OrderDetail.jsx`)**
- Get order ID from URL params
- Add state: order, loading, error
- Fetch order by ID on mount
- Display order ID, date, status badge
- Display order items list
- Display total amount
- Display shipping address
- Add back button to orders list

### Phase 6: Admin Features

**Step 16: Create Admin Products Page (`pages/AdminProducts.jsx`)**
- Add state: products, showForm, editingProduct, pendingDeleteId, page, pagination, formData, loading, error, success
- Fetch products on mount and when page changes
- Create form for product creation/editing
- Handle form submission: POST (create) or PUT (update)
- Create handleEdit function (pre-fill form with product data)
- Create handleDelete function
- Display products in grid with Edit/Delete buttons
- Create delete confirmation modal
- Add pagination controls

**Step 17: Create Admin Orders Page (`pages/AdminOrders.jsx`)**
- Add state: orders, pagination, page, statusFilter, loading, error
- Fetch orders on mount and when page/filter changes
- Add status filter dropdown
- Display all orders with customer info
- Add status update dropdown for each order
- Handle status update: PUT /api/orders/:id/status
- Add pagination controls

### Phase 7: Additional Features

**Step 18: Create AI Assistant Page (`pages/AIAssistant.jsx`)**
- Add state: question, productId, products, response, loading, error
- Fetch products on mount for dropdown
- Create form with optional product selection and question input
- Handle form submission: POST /api/ai/ask
- Display AI response or error message

### Phase 8: Styling & Polish

**Step 19: Create CSS Module Styles (`styles/ui.module.css`)**
- Define base styles (container, buttons, inputs, cards)
- Create component-specific styles
- Add responsive design rules
- Style loading states, error messages, success messages
- Style pagination, modals, dropdowns

**Step 20: Final Touches**
- Add error boundaries (optional)
- Test all user flows
- Add loading states everywhere
- Ensure proper error handling
- Test authentication flow
- Test protected routes
- Test admin-only routes

---

## Session 1: Project Setup & Core Architecture (45 minutes)

### 1.1 Entry Point: `main.jsx` (5 minutes)

**Purpose**: The application entry point that bootstraps React.

**Key Concepts**:
- ReactDOM.createRoot: Modern React 18 API for rendering
- React.StrictMode: Development mode checks and warnings
- CSS Module import: Global styles application

**Code Flow**:
1. Import React and ReactDOM
2. Import App component and CSS
3. Create root and render App in StrictMode
4. Mount to DOM element with id="root"

### 1.2 API Configuration: `api.js` (15 minutes)

**Purpose**: Centralized HTTP client with authentication interceptors.

**Key Concepts**:
- Axios instance creation
- Request interceptors (adding tokens)
- Response interceptors (handling 401 errors)
- Environment variables in Vite

**Code Flow**:
1. Create axios instance with base URL
2. Request interceptor adds token to headers
3. Response interceptor checks for 401 errors
4. On 401: clear token and redirect to login

### 1.3 Authentication Context: `AuthContext.jsx` (20 minutes)

**Purpose**: Global state management for user authentication.

**Key Concepts**:
- React Context API
- useState and useEffect hooks
- Token persistence in localStorage
- Session restoration on app load

**Code Flow**:
1. Component mounts → check for token in localStorage
2. If token exists → call `/api/auth/me` to verify
3. On success → set user state
4. On failure → remove invalid token
5. Provide login/logout functions to children

### 1.4 App Structure: `App.jsx` (5 minutes)

**Purpose**: Main application component with routing setup.

**Key Concepts**:
- BrowserRouter for client-side routing
- Route definitions
- Protected routes
- Layout structure (NavBar, Footer, Main)

---

## Session 2: Authentication & Routing (45 minutes)

### 2.1 Protected Routes: `ProtectedRoute.jsx` (10 minutes)

**Purpose**: Route guard component that checks authentication before rendering.

**Key Concepts**:
- Conditional rendering
- React Router Navigate component
- Role-based access control

**Code Flow**:
1. Check if auth is loading → show loading indicator
2. Check if user exists → redirect to login if not
3. Check if role is required → redirect to home if insufficient
4. If all checks pass → render children

### 2.2 Login Page: `Login.jsx` (15 minutes)

**Purpose**: User authentication form.

**Key Concepts**:
- Controlled inputs
- Form submission handling
- Error state management
- Password visibility toggle
- Navigation after success

**Code Flow**:
1. User enters email and password
2. Form submission → API call to `/api/auth/login`
3. On success → call `login()` from context → navigate to home
4. On error → display error message

### 2.3 Register Page: `Register.jsx` (10 minutes)

**Purpose**: New user registration form.

**Key Concepts**:
- Similar to Login but with name field
- Password validation (minLength)
- Registration API call

**Code Flow**:
1. User enters name, email, and password
2. Form submission → API call to `/api/auth/register`
3. On success → auto-login and navigate to home
4. On error → display error message

### 2.4 Navigation: `NavBar.jsx` (10 minutes)

**Purpose**: Top navigation bar with user menu and admin dropdown.

**Key Concepts**:
- Conditional rendering based on auth state
- Dropdown menu management
- Click outside detection
- Role-based menu items

---

## Session 3: Components & Pages (45 minutes)

### 3.1 Reusable Components (15 minutes)

#### Input Component
- forwardRef pattern
- Variant support
- Class name composition

#### Select Component
- Custom dropdown implementation
- Portal rendering
- Keyboard navigation
- Accessibility features

#### ProductCard Component
- Product display card
- Stock status indicators
- Image fallback handling
- Link to product detail

#### OrderCard Component
- Order summary display
- Status badge styling
- Date formatting
- Item count calculation

### 3.2 Products Page: `Products.jsx` (15 minutes)

**Purpose**: Product listing with search, filter, and pagination.

**Key Concepts**:
- Server-side search and filtering
- Client-side sorting
- Pagination state management
- useMemo for performance optimization

**Code Flow**:
1. Load categories on mount
2. Fetch products based on search, category, and page
3. Sort products client-side based on selected sort option
4. Display pagination controls
5. Handle filter changes → reset to page 1

### 3.3 Product Detail Page: `ProductDetail.jsx` (10 minutes)

**Purpose**: Individual product view with add to cart functionality.

**Key Concepts**:
- URL parameter extraction (`useParams`)
- Quantity input with stock validation
- Navigation with state

**Code Flow**:
1. Extract product ID from URL params
2. Fetch product details from API
3. Display product information
4. User selects quantity and clicks "Add to Order"
5. Navigate to /orders/create with product state

### 3.4 Create Order Page: `CreateOrder.jsx` (5 minutes)

**Purpose**: Shopping cart and checkout form.

**Key Concepts**:
- Local cart state management
- Product fetching for cart items
- Shipping address form
- Order submission

**Code Flow**:
1. Check if product was passed from ProductDetail, add to cart
2. Display cart items with quantity controls
3. User fills shipping address form
4. Submit order → POST /api/orders
5. Navigate to order detail page on success

---

## Session 4: Advanced Features & API Integration (45 minutes)

### 4.1 Orders Management (15 minutes)

#### Orders Page: `Orders.jsx`
- User's order history
- Pagination
- OrderCard component usage

#### Order Detail Page: `OrderDetail.jsx`
- Full order information display
- Item list rendering
- Shipping address display
- Status badge

**Code Flow**:
1. Extract order ID from URL params
2. Fetch order details from API
3. Display order information, items, totals, and shipping address
4. Show status badge with appropriate styling

### 4.2 Admin Features (20 minutes)

#### Admin Products Page: `AdminProducts.jsx`
- CRUD operations (Create, Read, Update, Delete)
- Form state management
- Delete confirmation modal
- Product editing flow

**Key Concepts**:
- Form data state
- Edit vs Create mode
- Modal implementation
- API calls for CRUD operations

**Code Flow**:
1. Fetch products on mount
2. Click "Add New Product" → show form
3. Click "Edit" → pre-fill form with product data
4. Submit form → POST (create) or PUT (update)
5. Click "Delete" → show confirmation modal
6. Confirm delete → DELETE request → refresh list

#### Admin Orders Page: `AdminOrders.jsx`
- All orders listing (admin view)
- Status filtering
- Status update functionality

**Code Flow**:
1. Fetch all orders on mount
2. Filter by status if selected
3. Update order status via dropdown
4. PUT request to /api/orders/:id/status
5. Refresh orders list after update

### 4.3 AI Assistant: `AIAssistant.jsx` (10 minutes)

**Purpose**: AI-powered product assistant.

**Key Concepts**:
- Optional product selection
- Question submission
- Response display

**Code Flow**:
1. Fetch products for dropdown selection
2. User optionally selects a product
3. User enters question
4. Submit → POST /api/ai/ask
5. Display AI response or error message

---

## Key Patterns & Best Practices

### 1. State Management Pattern
- Local state with `useState` for component-specific data
- Context API for global auth state
- No external state management library needed

### 2. API Call Pattern
```javascript
try {
  setLoading(true);
  const { data } = await api.get('/endpoint');
  setData(data);
} catch (err) {
  setError(err.response?.data?.message || 'Error message');
} finally {
  setLoading(false);
}
```

### 3. Protected Route Pattern
- Wrap routes with `<ProtectedRoute>`
- Use `requireRole` prop for admin-only routes
- Automatic redirect on unauthorized access

### 4. Form Handling Pattern
- Controlled inputs with `value` and `onChange`
- Form submission with `onSubmit`
- Error state display
- Loading state during submission

### 5. Navigation Pattern
- Use `Link` for internal navigation
- Use `navigate()` for programmatic navigation
- Pass state via `navigate('/path', { state: {...} })`

---

## Common Student Questions & Answers

### Q: Why use Context API instead of Redux?
**A**: For this app, Context API is sufficient. It's simpler and has less boilerplate. Redux is better for complex state management needs.

### Q: Why interceptors instead of adding token in each API call?
**A**: DRY principle - write once, use everywhere. Centralized token management is easier to maintain.

### Q: Why client-side sorting for products?
**A**: Server-side sorting is also implemented. Client-side sorting provides instant feedback without API calls for better UX.

### Q: Why localStorage for tokens?
**A**: Simple persistence across page refreshes. For production, consider httpOnly cookies for better security.

### Q: How does ProtectedRoute work?
**A**: It checks auth context before rendering. If no user, redirects to login. If role required but missing, redirects to home.

---

## Teaching Tips

1. **Start with the flow**: Show how a user logs in → browses products → creates order
2. **Explain patterns**: Emphasize reusable patterns (API calls, form handling)
3. **Debug together**: Show how to debug API calls, state updates, routing
4. **Compare components**: Show similarities between Login/Register, Products/AdminProducts
5. **Live coding**: Add a new feature together (e.g., favorite products)

---

## Practice Exercises for Students

1. **Add a search feature to Orders page**
2. **Create a "Recently Viewed Products" component**
3. **Add product reviews/ratings**
4. **Implement a wishlist feature**
5. **Add order cancellation for users**

---

## Additional Resources

- React Router documentation
- Axios interceptors guide
- React Context API patterns
- CSS Modules usage
- Vite environment variables

---

**End of Teaching Guide**
