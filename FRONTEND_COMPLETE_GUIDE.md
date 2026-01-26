# Frontend Project Complete Flow & Teaching Guide
## Product & Order Management System

## Table of Contents
1. [Project Architecture Overview](#project-architecture-overview)
2. [File Structure & Logic Flow](#file-structure--logic-flow)
3. [Core Components](#core-components)
4. [Pages & User Flows](#pages--user-flows)
5. [API Integration & State Management](#api-integration--state-management)
6. [Routing & Navigation](#routing--navigation)
7. [Styling & UI System](#styling--ui-system)
8. [Testing Guide](#testing-guide)
9. [Common Issues & Solutions](#common-issues--solutions)

---

## Project Architecture Overview

### Technology Stack (from `frontend/package.json`)
- **Framework**: React `^18.2.0`
- **Build Tool**: Vite `^5.2.0`
- **Routing**: React Router DOM `^6.22.3`
- **HTTP Client**: Axios `^1.6.8`
- **Styling**: CSS Modules (`ui.module.css`)

### Architecture Pattern
- **Component-Based**: Reusable, isolated UI pieces
- **Context API**: Global auth state (user, login/logout)
- **Protected Routes**: Route guards for auth + role
- **API Layer**: Centralized Axios instance with interceptors

---

## File Structure & Logic Flow

```
frontend/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── api.js
    ├── context/
    │   └── AuthContext.jsx
    ├── components/
    │   ├── Footer.jsx
    │   ├── Input.jsx
    │   ├── Logo.jsx
    │   ├── NavBar.jsx
    │   ├── OrderCard.jsx
    │   ├── ProductCard.jsx
    │   ├── ProtectedRoute.jsx
    │   └── Select.jsx
    ├── pages/
    │   ├── AdminOrders.jsx
    │   ├── AdminProducts.jsx
    │   ├── AIAssistant.jsx
    │   ├── CreateOrder.jsx
    │   ├── Login.jsx
    │   ├── OrderDetail.jsx
    │   ├── Orders.jsx
    │   ├── ProductDetail.jsx
    │   ├── Products.jsx
    │   └── Register.jsx
    └── styles/
        └── ui.module.css
```

---

## Core Components

### `src/main.jsx`
**Purpose**: App bootstrap
```
1. Import App
2. Import UI module CSS
3. Render App inside React.StrictMode
```

### `src/api.js`
**Purpose**: Axios instance with interceptors
```
1. Base URL from VITE_API_BASE (fallback to http://localhost:5000)
2. Add Authorization: Bearer <token> if present
3. On 401: clear token and redirect to /login
```

### `src/context/AuthContext.jsx`
**State**:
- `user`: logged in user (null if none)
- `loading`: auth check status

**Behavior**:
- On mount, calls `/api/auth/me` if token exists
- `login(token, user)`: save token + set user
- `logout()`: clear token + user

### `src/components/ProtectedRoute.jsx`
- Shows loading state while auth check runs
- Redirects unauthenticated users to `/login`
- Redirects non-admin users to `/` when `requireRole="admin"`

---

## Pages & User Flows

### `Login.jsx`
- Controlled inputs, show/hide password
- Calls `POST /api/auth/login`
- On success: `login()` + navigate to `/`

### `Register.jsx`
- Controlled inputs, show/hide password
- Calls `POST /api/auth/register`
- On success: `login()` + navigate to `/`

### `Products.jsx`
- Fetches categories and products
- Server-side search + category filter
- Client-side sorting (featured, price, name)
- Pagination (12 items per page)
- Reset filters button

### `ProductDetail.jsx`
- Fetches product by ID
- Quantity input capped by stock
- "Add to Order" navigates to `/orders/create` with location state

### `CreateOrder.jsx`
- Cart state stored locally in component state
- Adds initial product if coming from ProductDetail
- Updates quantities and calculates total
- Submits to `POST /api/orders` with shipping address

### `Orders.jsx`
- Fetches user orders with pagination (10 per page)
- Uses `OrderCard` for display

### `OrderDetail.jsx`
- Fetches order by ID
- Shows items, totals, shipping address, and status badge

### `AdminProducts.jsx`
- Admin CRUD for products
- Create/edit form matches backend validation
- Delete confirmation modal

### `AdminOrders.jsx`
- Admin list of all orders
- Status filter + status update dropdown

### `AIAssistant.jsx`
- Optional product selection for context
- Sends `question` and `productId` to `/api/ai/ask`
- Renders AI response or error state

---

## API Integration & State Management

### API Base URL
```
VITE_API_BASE=http://localhost:5000
```

### Authentication Flow
1. Login/Register → token stored in localStorage
2. App boot → `/api/auth/me` restores session
3. 401 response → token cleared + redirect to `/login`

### Example API Pattern
```javascript
try {
  setLoading(true);
  const { data } = await api.get('/api/products', { params: { page: 1 } });
  setProducts(data.products);
} catch (err) {
  setError(err.response?.data?.message || 'Request failed');
} finally {
  setLoading(false);
}
```

---

## Routing & Navigation

### Route Map
```
/                 → Products (Protected)
/products/:id     → ProductDetail (Protected)
/orders/create    → CreateOrder (Protected)
/orders           → Orders (Protected)
/orders/:id       → OrderDetail (Protected)
/admin/products   → AdminProducts (Protected, Admin only)
/admin/orders     → AdminOrders (Protected, Admin only)
/ai-assistant     → AIAssistant (Protected)
/login            → Login (Public)
/register         → Register (Public)
```

### Navigation Behavior
- Authenticated users see Products, My Orders, AI Assistant
- Admin users see Admin dropdown with manage tools
- Footer is always visible

---

## Styling & UI System

### CSS Modules
- All UI styles live in `src/styles/ui.module.css`
- Components import styles as `styles.*`

### Shared UI Components
- `Input`: styled input component with variants
- `Select`: accessible custom dropdown
- `NavBar` + `Footer`: brand, links, account menus

---

## Testing Guide

### Authentication
- Register new user (success + duplicate email error)
- Login success and invalid credentials
- Logout clears token
- Refresh maintains session

### Products
- Browse products
- Search and filter
- Sort by price/name
- Pagination
- Product detail + add to order

### Orders
- Create order
- Empty cart handling
- View order history
- View order detail

### Admin
- Create, edit, delete product
- Filter orders by status
- Update order status

### AI Assistant
- Ask general question
- Ask question with product context
- Handle missing AI key (demo response)

---

## Common Issues & Solutions

### Issue 1: CORS Errors
**Fix**:
1. Ensure backend `CLIENT_ORIGIN` matches frontend URL
2. No trailing slash in origin
3. Restart backend after env changes

### Issue 2: Token Not Persisting
**Fix**:
1. Confirm token saved in localStorage
2. Verify `/api/auth/me` succeeds
3. Check 401 interceptor behavior

### Issue 3: API Calls Failing
**Fix**:
1. Confirm backend running on port 5000
2. Check `VITE_API_BASE` matches backend
3. Test `/api/health` endpoint

---

## Quick Reference

### Default URLs
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **API Base**: `http://localhost:5000/api`

### Key Commands
```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

---

**End of Document**
