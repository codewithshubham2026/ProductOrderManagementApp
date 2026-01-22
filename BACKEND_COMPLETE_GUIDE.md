# Backend Project Complete Flow & Testing Guide
## Product & Order Management System

## Table of Contents
1. [Project Architecture Overview](#project-architecture-overview)
2. [File Structure & Logic Flow](#file-structure--logic-flow)
3. [Complete API Endpoints](#complete-api-endpoints)
4. [Postman Testing Guide](#postman-testing-guide)
5. [Error Scenarios & Success Responses](#error-scenarios--success-responses)

---

## Project Architecture Overview

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **AI Integration**: Google Gemini AI

### Architecture Pattern
- **MVC-like Pattern**: Controllers → Services → Models
- **Middleware Chain**: Request → Validation → Authentication → Authorization → Controller → Service → Response
- **Error Handling**: Centralized error handler middleware

---

## File Structure & Logic Flow

### 1. Entry Point: `src/server.js`
**Purpose**: Application bootstrap and route mounting

**Logic Flow**:
```
1. Load environment variables
2. Connect to MongoDB database
3. Seed default admin user
4. Setup Express app with middleware:
   - CORS configuration
   - JSON body parser
5. Mount route handlers:
   - /api/auth → Authentication routes
   - /api/products → Product management routes
   - /api/orders → Order management routes
   - /api/ai → AI assistant routes
6. Setup error handler middleware
7. Start server on configured port
```

**Key Dependencies**:
- `config/db.js` - Database connection
- `config/env.js` - Environment configuration
- `utils/seedAdmin.js` - Admin user seeding
- `routes/*` - Route definitions
- `middlewares/errorHandler.js` - Error handling

---

### 2. Configuration Files

#### `src/config/env.js`
**Purpose**: Centralized environment variable management

**Logic**:
- Loads `.env` file using dotenv
- Provides default values for development
- Validates critical environment variables
- Exports configuration object

**Environment Variables**:
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_ORIGIN` - Frontend URL for CORS
- `GEMINI_API_KEY` - Google Gemini API key (optional)
- `ADMIN_EMAIL` - Default admin email
- `ADMIN_PASSWORD` - Default admin password
- `ADMIN_NAME` - Default admin name

#### `src/config/db.js`
**Purpose**: MongoDB connection

**Logic Flow**:
```
1. Connect to MongoDB using Mongoose
2. Handle connection errors (IP whitelist, network issues)
3. Return connection promise
```

---

### 3. Database Models

#### `src/models/User.js`
**Purpose**: User schema definition

**Schema Structure**:
```javascript
{
  name: String (required, trimmed)
  email: String (required, unique, lowercase, trimmed)
  password: String (required, hashed)
  role: String (enum: ['admin', 'user'], default: 'user')
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

#### `src/models/Product.js`
**Purpose**: Product schema definition

**Schema Structure**:
```javascript
{
  name: String (required, trimmed)
  description: String (required, trimmed)
  price: Number (required, min: 0)
  category: String (required, trimmed)
  stock: Number (required, min: 0, default: 0)
  image: String (optional, trimmed)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Indexes**:
- Text index on `name` and `description` for search

#### `src/models/Order.js`
**Purpose**: Order schema with nested items

**Schema Structure**:
```javascript
{
  user: ObjectId (ref: 'User', required)
  items: [{
    product: ObjectId (ref: 'Product', required)
    quantity: Number (required, min: 1)
    price: Number (required, min: 0)
  }]
  totalAmount: Number (required, min: 0)
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending')
  shippingAddress: {
    street: String (required)
    city: String (required)
    state: String (required)
    zipCode: String (required)
  }
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Key Relationships**:
- Order belongs to User
- Order contains Product references
- Order items store price snapshot (price may change later)

---

### 4. Authentication Routes: `src/routes/authRoutes.js`

**Base Path**: `/api/auth`

**Endpoints**:
1. `POST /api/auth/register` - User registration
2. `POST /api/auth/login` - User login
3. `GET /api/auth/me` - Get current user profile

**Middleware Chain**:
- Register: `registerValidator` → `validateRequest` → `register` controller
- Login: `loginValidator` → `validateRequest` → `login` controller
- Me: `authenticate` → `me` controller

---

### 5. Authentication Controllers: `src/controllers/authController.js`

#### `register(req, res, next)`
**Logic Flow**:
```
1. Extract { name, email, password } from req.body
2. Call authService.registerUser()
3. Return 201 status with user data and token
4. Handle errors via next(error)
```

#### `login(req, res, next)`
**Logic Flow**:
```
1. Extract { email, password } from req.body
2. Call authService.loginUser()
3. Return 200 status with user data and token
4. Handle errors via next(error)
```

#### `me(req, res)`
**Logic Flow**:
```
1. Extract user from req.user (set by auth middleware)
2. Sanitize user (remove password)
3. Return 200 status with user data
```

---

### 6. Authentication Services: `src/services/authService.js`

#### `registerUser({ name, email, password })`
**Logic Flow**:
```
1. Check if email already exists in database
   → If exists: throw error (400)
2. Hash password using bcrypt (10 rounds)
3. Create user with role='user'
4. Generate JWT token
5. Sanitize user (remove password)
6. Return { user, token }
```

#### `loginUser({ email, password })`
**Logic Flow**:
```
1. Find user by email
   → If not found: throw error (401)
2. Compare provided password with hashed password
   → If mismatch: throw error (401)
3. Generate JWT token
4. Sanitize user (remove password)
5. Return { user, token }
```

---

### 7. Product Routes: `src/routes/productRoutes.js`

**Base Path**: `/api/products`

**Endpoints**:
1. `GET /api/products` - Get all products (with search, filter, pagination)
2. `GET /api/products/categories` - Get all categories
3. `GET /api/products/:id` - Get single product
4. `POST /api/products` - Create product (admin only)
5. `PUT /api/products/:id` - Update product (admin only)
6. `DELETE /api/products/:id` - Delete product (admin only)

**Middleware Chain**:
- Public routes: No auth required
- Admin routes: `authenticate` → `authorizeRole('admin')` → validators → `validateRequest` → controllers

---

### 8. Product Controllers: `src/controllers/productController.js`

#### `getAllProducts(req, res, next)`
**Logic Flow**:
```
1. Extract query params: { search, category, page, limit }
2. Call productService.getProducts()
3. Return 200 status with products and pagination
4. Handle errors via next(error)
```

#### `getProduct(req, res, next)`
**Logic Flow**:
```
1. Extract product ID from req.params
2. Call productService.getProductById()
3. Return 200 status with product
4. Handle errors via next(error)
```

#### `create(req, res, next)`
**Logic Flow**:
```
1. Extract product data from req.body
2. Call productService.createProduct()
3. Return 201 status with created product
4. Handle errors via next(error)
```

---

### 9. Product Services: `src/services/productService.js`

#### `getProducts({ search, category, page, limit })`
**Logic Flow**:
```
1. Build MongoDB query:
   - If search: Add $or with name/description regex
   - If category: Add category filter
2. Calculate skip = (page - 1) * limit
3. Execute parallel queries:
   - Find products with skip/limit
   - Count total documents
4. Return { products, pagination }
```

#### `createProduct({ name, description, price, category, stock, image })`
**Logic Flow**:
```
1. Create product document
2. Save to database
3. Return created product
```

#### `updateProduct(productId, data)`
**Logic Flow**:
```
1. Find product by ID
   → If not found: throw error (404)
2. Update product with new data
3. Return updated product
```

#### `deleteProduct(productId)`
**Logic Flow**:
```
1. Find and delete product by ID
   → If not found: throw error (404)
2. Return deleted product
```

---

### 10. Order Routes: `src/routes/orderRoutes.js`

**Base Path**: `/api/orders`

**Endpoints**:
1. `POST /api/orders` - Create order (user only)
2. `GET /api/orders/my-orders` - Get user's orders
3. `GET /api/orders/:id` - Get order details
4. `GET /api/orders/admin/all` - Get all orders (admin only)
5. `PUT /api/orders/:id/status` - Update order status (admin only)

**Middleware Chain**:
- All routes: `authenticate` (required)
- Admin routes: `authenticate` → `authorizeRole('admin')` → validators → `validateRequest` → controllers

---

### 11. Order Controllers: `src/controllers/orderController.js`

#### `create(req, res, next)`
**Logic Flow**:
```
1. Extract { items, shippingAddress } from req.body
2. Extract userId from req.user._id
3. Call orderService.createOrder()
4. Return 201 status with created order
5. Handle errors via next(error)
```

#### `getMyOrders(req, res, next)`
**Logic Flow**:
```
1. Extract userId from req.user._id
2. Extract query params: { page, limit }
3. Call orderService.getUserOrders()
4. Return 200 status with orders and pagination
5. Handle errors via next(error)
```

#### `getOrder(req, res, next)`
**Logic Flow**:
```
1. Extract orderId from req.params
2. Extract userId and role from req.user
3. Call orderService.getOrderById()
4. Return 200 status with order
5. Handle errors via next(error)
```

---

### 12. Order Services: `src/services/orderService.js`

#### `createOrder(userId, { items, shippingAddress })`
**Logic Flow**:
```
1. Validate items array is not empty
2. For each item:
   - Find product by ID
   - Check stock availability
   - Calculate item total
   - Add to orderItems array
   - Decrement product stock
3. Calculate totalAmount
4. Create order document
5. Populate product details
6. Return order
```

**Stock Management**:
- Stock is decremented when order is created
- Prevents overselling
- Throws error if insufficient stock

#### `getUserOrders(userId, { page, limit })`
**Logic Flow**:
```
1. Build query: { user: userId }
2. Calculate skip = (page - 1) * limit
3. Find orders with pagination
4. Populate product details
5. Return { orders, pagination }
```

#### `getOrderById(orderId, userId, userRole)`
**Logic Flow**:
```
1. Find order by ID
   → If not found: throw error (404)
2. Check access:
   - If admin: Allow access
   - If user: Check if order belongs to user
   → If not authorized: throw error (403)
3. Populate product and user details
4. Return order
```

#### `updateOrderStatus(orderId, status)`
**Logic Flow**:
```
1. Validate status is valid enum value
2. Find and update order status
   → If not found: throw error (404)
3. Populate details
4. Return updated order
```

---

### 13. AI Routes: `src/routes/aiRoutes.js`

**Base Path**: `/api/ai`

**Endpoints**:
1. `POST /api/ai/ask` - Ask AI question about products

**Middleware Chain**:
- `authenticate` → `aiQueryValidator` → `validateRequest` → `askQuestion` controller

---

### 14. AI Controllers: `src/controllers/aiController.js`

#### `askQuestion(req, res, next)`
**Logic Flow**:
```
1. Extract { question, productId } from req.body
2. Call aiService.getProductAssistantResponse()
3. Return 200 status with AI response
4. Handle errors via next(error)
```

---

### 15. AI Services: `src/services/aiService.js`

#### `getProductAssistantResponse(userQuestion, productId)`
**Logic Flow**:
```
1. Check if GEMINI_API_KEY exists
   → If not: throw error
2. If productId provided:
   - Fetch product details
   - Build context string
3. Create prompt with product context
4. Call Gemini API with prompt
5. Return AI response text
```

**Security**:
- API key stays on backend (never exposed to frontend)
- Product context is safely passed to AI
- Errors are handled gracefully

---

### 16. Middleware Files

#### `src/middlewares/authMiddleware.js`

**`authenticate(req, res, next)`**
**Logic Flow**:
```
1. Extract Authorization header
   → If missing or not "Bearer <token>": return 401
2. Extract token from "Bearer <token>"
3. Verify JWT token using JWT_SECRET
   → If invalid/expired: return 401
4. Find user by decoded.id
   → If not found: return 401
5. Attach user to req.user (without password)
6. Call next()
```

**`authorizeRole(role)`**
**Logic Flow**:
```
1. Returns middleware function
2. Check if req.user exists and req.user.role === role
   → If not: return 403 Forbidden
3. Call next()
```

#### `src/middlewares/validateRequest.js`
**Logic Flow**:
```
1. Collect validation errors from express-validator
2. If errors exist:
   - Return 400 with error details
3. If no errors: call next()
```

#### `src/middlewares/errorHandler.js`
**Logic Flow**:
```
1. Log error message and stack trace
2. Extract status code from error.status or default to 500
3. Return JSON response with success: false and error message
```

---

### 17. Validators

#### `src/validators/authValidators.js`

**`registerValidator`**:
- `name`: Required, trimmed, 2-50 characters
- `email`: Valid email format
- `password`: Minimum 6 characters

**`loginValidator`**:
- `email`: Valid email format
- `password`: Required, not empty

#### `src/validators/productValidators.js`

**`productValidator`**:
- `name`: Required, 2-100 characters
- `description`: Required, 10-1000 characters
- `price`: Required, positive number
- `category`: Required, 2-50 characters
- `stock`: Required, non-negative integer
- `image`: Optional, valid URL

#### `src/validators/orderValidators.js`

**`createOrderValidator`**:
- `items`: Array with at least one item
- `items[].productId`: Valid MongoDB ObjectId
- `items[].quantity`: Integer >= 1
- `shippingAddress.*`: All fields required

**`updateOrderStatusValidator`**:
- `status`: Required, must be valid enum value

---

## Complete API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Health Check
- **Endpoint**: `GET /api/health`
- **Auth**: Not required
- **Response**: `{ success: true, message: 'API is healthy' }`

---

### Authentication Endpoints

#### 1. Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Auth**: Not required
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### 2. Login User
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Auth**: Not required
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### 3. Get Current User
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Auth**: Required (Bearer token)
- **Success Response** (200):
  ```json
  {
    "success": true,
    "user": { ... }
  }
  ```

---

### Product Endpoints

#### 4. Get All Products
- **Method**: `GET`
- **Path**: `/api/products`
- **Auth**: Not required
- **Query Parameters**:
  - `search` (optional): Search in name/description
  - `category` (optional): Filter by category
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Example**: `/api/products?search=laptop&category=Electronics&page=1&limit=12`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "products": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 100,
      "pages": 9
    }
  }
  ```

#### 5. Get Categories
- **Method**: `GET`
- **Path**: `/api/products/categories`
- **Auth**: Not required
- **Success Response** (200):
  ```json
  {
    "success": true,
    "categories": ["Electronics", "Clothing", "Books"]
  }
  ```

#### 6. Get Single Product
- **Method**: `GET`
- **Path**: `/api/products/:id`
- **Auth**: Not required
- **Success Response** (200):
  ```json
  {
    "success": true,
    "product": { ... }
  }
  ```

#### 7. Create Product (Admin Only)
- **Method**: `POST`
- **Path**: `/api/products`
- **Auth**: Required (Admin only)
- **Body**:
  ```json
  {
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50,
    "image": "https://example.com/image.jpg"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "product": { ... }
  }
  ```

#### 8. Update Product (Admin Only)
- **Method**: `PUT`
- **Path**: `/api/products/:id`
- **Auth**: Required (Admin only)
- **Body**: Same as create (all fields optional)
- **Success Response** (200):
  ```json
  {
    "success": true,
    "product": { ... }
  }
  ```

#### 9. Delete Product (Admin Only)
- **Method**: `DELETE`
- **Path**: `/api/products/:id`
- **Auth**: Required (Admin only)
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

---

### Order Endpoints

#### 10. Create Order (User Only)
- **Method**: `POST`
- **Path**: `/api/orders`
- **Auth**: Required
- **Body**:
  ```json
  {
    "items": [
      {
        "productId": "product_id_1",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "order": {
      "_id": "order_id",
      "user": "user_id",
      "items": [ ... ],
      "totalAmount": 199.98,
      "status": "pending",
      "shippingAddress": { ... }
    }
  }
  ```

#### 11. Get User Orders
- **Method**: `GET`
- **Path**: `/api/orders/my-orders`
- **Auth**: Required
- **Query Parameters**: `page`, `limit`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "orders": [ ... ],
    "pagination": { ... }
  }
  ```

#### 12. Get Order Details
- **Method**: `GET`
- **Path**: `/api/orders/:id`
- **Auth**: Required
- **Success Response** (200):
  ```json
  {
    "success": true,
    "order": { ... }
  }
  ```

#### 13. Get All Orders (Admin Only)
- **Method**: `GET`
- **Path**: `/api/orders/admin/all`
- **Auth**: Required (Admin only)
- **Query Parameters**: `page`, `limit`, `status`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "orders": [ ... ],
    "pagination": { ... }
  }
  ```

#### 14. Update Order Status (Admin Only)
- **Method**: `PUT`
- **Path**: `/api/orders/:id/status`
- **Auth**: Required (Admin only)
- **Body**:
  ```json
  {
    "status": "processing"
  }
  ```
- **Valid Statuses**: `pending`, `processing`, `shipped`, `delivered`, `cancelled`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "order": { ... }
  }
  ```

---

### AI Endpoints

#### 15. Ask AI Question
- **Method**: `POST`
- **Path**: `/api/ai/ask`
- **Auth**: Required
- **Body**:
  ```json
  {
    "question": "What are the features of this product?",
    "productId": "product_id" // optional
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "response": "AI response text here..."
  }
  ```

---

## Postman Testing Guide

### Setup Instructions

1. **Import Environment Variables**:
   - Create a new environment in Postman
   - Add variables:
     - `base_url`: `http://localhost:5000/api`
     - `admin_token`: (will be set after login)
     - `user_token`: (will be set after login)
     - `product_id`: (will be set after creating product)
     - `order_id`: (will be set after creating order)

2. **Create Collection**: "Product Order Management API"

---

### Test Cases

#### Test 1: Health Check
- **Method**: `GET`
- **URL**: `{{base_url}}/health`
- **Expected**: 200 OK

#### Test 2: Register User
- **Method**: `POST`
- **URL**: `{{base_url}}/auth/register`
- **Body**:
  ```json
  {
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```
- **Action**: Save `token` to `user_token`

#### Test 3: Login Admin
- **Method**: `POST`
- **URL**: `{{base_url}}/auth/login`
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "admin123"
  }
  ```
- **Action**: Save `token` to `admin_token`

#### Test 4: Create Product (Admin)
- **Method**: `POST`
- **URL**: `{{base_url}}/products`
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**:
  ```json
  {
    "name": "Test Laptop",
    "description": "A high-performance laptop for testing",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50,
    "image": "https://example.com/laptop.jpg"
  }
  ```
- **Action**: Save `product._id` to `product_id`

#### Test 5: Get All Products
- **Method**: `GET`
- **URL**: `{{base_url}}/products?page=1&limit=10`
- **Expected**: 200 OK with products array

#### Test 6: Search Products
- **Method**: `GET`
- **URL**: `{{base_url}}/products?search=laptop`
- **Expected**: 200 OK with filtered products

#### Test 7: Create Order (User)
- **Method**: `POST`
- **URL**: `{{base_url}}/orders`
- **Headers**: `Authorization: Bearer {{user_token}}`
- **Body**:
  ```json
  {
    "items": [
      {
        "productId": "{{product_id}}",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "street": "123 Test St",
      "city": "Test City",
      "state": "TS",
      "zipCode": "12345"
    }
  }
  ```
- **Action**: Save `order._id` to `order_id`

#### Test 8: Get My Orders
- **Method**: `GET`
- **URL**: `{{base_url}}/orders/my-orders`
- **Headers**: `Authorization: Bearer {{user_token}}`
- **Expected**: 200 OK with user's orders

#### Test 9: Update Order Status (Admin)
- **Method**: `PUT`
- **URL**: `{{base_url}}/orders/{{order_id}}/status`
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**:
  ```json
  {
    "status": "processing"
  }
  ```
- **Expected**: 200 OK with updated order

#### Test 10: Ask AI Question
- **Method**: `POST`
- **URL**: `{{base_url}}/ai/ask`
- **Headers**: `Authorization: Bearer {{user_token}}`
- **Body**:
  ```json
  {
    "question": "What is this product good for?",
    "productId": "{{product_id}}"
  }
  ```
- **Expected**: 200 OK with AI response

---

## Error Scenarios & Success Responses

### HTTP Status Codes

| Status Code | Meaning | When Used |
|------------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE requests |
| 201 | Created | Successful POST (register, create product/order) |
| 400 | Bad Request | Validation errors, business logic errors |
| 401 | Unauthorized | Missing/invalid token, wrong credentials |
| 403 | Forbidden | Insufficient role permissions |
| 404 | Not Found | Resource not found (product, order, user) |
| 500 | Internal Server Error | Server-side errors |

### Common Error Response Format

```json
{
  "success": false,
  "message": "Error message here"
}
```

**With Validation Errors**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Error message",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

### Success Response Format

```json
{
  "success": true,
  "data": { ... }
}
```

---

## Security Features

1. **Password Hashing**: bcryptjs with 10 salt rounds
2. **JWT Tokens**: 7-day expiry, signed with secret
3. **Role-Based Access Control**: Admin vs User roles
4. **Input Validation**: express-validator on all inputs
5. **CORS Protection**: Configured for specific origin
6. **Error Sanitization**: No sensitive data in error messages
7. **Stock Management**: Prevents overselling
8. **Order Access Control**: Users can only see their own orders

---

## Testing Checklist

- [ ] Health check endpoint
- [ ] User registration (success)
- [ ] User registration (duplicate email)
- [ ] User login (success)
- [ ] User login (invalid credentials)
- [ ] Get current user
- [ ] Create product (admin)
- [ ] Get all products
- [ ] Search products
- [ ] Filter products by category
- [ ] Get single product
- [ ] Update product (admin)
- [ ] Delete product (admin)
- [ ] Create order (user)
- [ ] Create order (insufficient stock)
- [ ] Get user orders
- [ ] Get order details
- [ ] Get all orders (admin)
- [ ] Update order status (admin)
- [ ] Ask AI question
- [ ] Ask AI with product context

---

## Quick Reference

### Default Admin Credentials
- **Email**: `admin@example.com`
- **Password**: `admin123`

### Base URL
```
http://localhost:5000/api
```

### Token Format
```
Authorization: Bearer <token>
```

---

## Notes

1. **Token Expiry**: JWT tokens expire after 7 days. Re-login to get a new token.
2. **Admin Seeding**: Default admin is created automatically on server start.
3. **AI Integration**: Requires GEMINI_API_KEY in `.env` file for live responses.
4. **Database**: Uses MongoDB. Ensure MongoDB is running before starting server.
5. **Stock Management**: Stock is decremented when order is created.
6. **Pagination**: Default limit is 10 items per page.

---

**End of Document**
