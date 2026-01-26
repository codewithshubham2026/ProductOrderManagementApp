# Backend Project Complete Flow & Teaching Guide
## Product & Order Management System

## Table of Contents
1. [Project Architecture Overview](#project-architecture-overview)
2. [File Structure & Logic Flow](#file-structure--logic-flow)
3. [Configuration & Environment](#configuration--environment)
4. [Database Models](#database-models)
5. [Routes, Controllers, Services](#routes-controllers-services)
6. [Middleware & Validators](#middleware--validators)
7. [Complete API Endpoints](#complete-api-endpoints)
8. [Postman Testing Guide](#postman-testing-guide)
9. [Error Scenarios & Responses](#error-scenarios--responses)
10. [Security & Operational Notes](#security--operational-notes)

---

## Project Architecture Overview

### Technology Stack (from `backend/package.json`)
- **Runtime**: Node.js
- **Framework**: Express.js `^4.19.2`
- **Database**: MongoDB with Mongoose `^7.6.3`
- **Authentication**: JWT via `jsonwebtoken` `^9.0.2`
- **Password Hashing**: `bcryptjs` `^2.4.3`
- **Validation**: `express-validator` `^7.2.1`
- **AI Integration**:
  - Google Gemini via `@google/generative-ai` `^0.24.1`
  - ChatGPT fallback via OpenAI REST API (Axios `^1.7.9`)

### Architecture Pattern
- **MVC-like**: Routes → Controllers → Services → Models
- **Middleware Chain**: CORS → JSON parsing → Auth/Validation → Controller → Error handler
- **Centralized Error Handling**: `errorHandler` at the end of the chain

---

## File Structure & Logic Flow

### Key Directories
- `src/config`: env + db setup
- `src/controllers`: HTTP request handlers
- `src/services`: business logic and DB operations
- `src/models`: Mongoose schemas
- `src/routes`: REST endpoints
- `src/middlewares`: auth, validation, error handling
- `src/validators`: request validation rules
- `src/utils`: token generation, admin seeding

### Entry Point: `backend/src/server.js`
**Purpose**: Application bootstrap and route mounting

**Logic Flow**:
```
1. Load environment variables
2. Configure CORS
3. Parse JSON bodies
4. Expose health check: GET /api/health
5. Mount routes:
   - /api/auth
   - /api/products
   - /api/orders
   - /api/ai
6. 404 handler for unknown routes
7. Error handler middleware
8. Connect to MongoDB
9. Seed default admin
10. Start server on 0.0.0.0
```

---

## Configuration & Environment

### `backend/src/config/env.js`
**Purpose**: Centralized environment variable management with safe defaults

**Environment Variables**:
- `PORT` (default: `5000`)
- `MONGO_URI` (default: `mongodb://127.0.0.1:27017/product_order_management`)
- `JWT_SECRET` (default: `change-me`)
- `CLIENT_ORIGIN` (default: `http://localhost:5173`)
- `ADMIN_EMAIL` (default: `admin@example.com`)
- `ADMIN_PASSWORD` (default: `admin123`)
- `ADMIN_NAME` (default: `Admin User`)
- `GEMINI_API_KEY` (optional)
- `GEMINI_MODEL` (default: `gemini-2.5-flash`)
- `CHATGPT_API_KEY` (optional)
- `CHATGPT_MODEL` (default: `gpt-4o-mini`)

**Notes**:
- If `JWT_SECRET` is missing or default, a warning is logged.
- A warning is logged if `GEMINI_API_KEY` is missing (ChatGPT can still work if configured).
- If neither AI key is set, the AI endpoint returns a demo response string.

---

## Database Models

### `backend/src/models/User.js`
```
{
  name: String (required, trimmed)
  email: String (required, unique, lowercase, trimmed)
  password: String (required, hashed)
  role: String (enum: ['admin', 'user'], default: 'user')
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### `backend/src/models/Product.js`
```
{
  name: String (required, trimmed)
  description: String (required, trimmed)
  price: Number (required, min: 0)
  category: String (required, trimmed)
  stock: Number (required, min: 0, default: 0)
  image: String (optional, trimmed, default: '')
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```
**Index**: Text index on `name` and `description`

### `backend/src/models/Order.js`
```
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
    street: String (required, trimmed)
    city: String (required, trimmed)
    state: String (required, trimmed)
    zipCode: String (required, trimmed)
  }
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

---

## Routes, Controllers, Services

### Authentication: `backend/src/routes/authRoutes.js`
**Base Path**: `/api/auth`
1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `GET /api/auth/me` (protected)

**Auth Service Highlights**:
- Passwords hashed with bcrypt (10 rounds)
- JWT created in `utils/generateToken.js` (7-day expiry)
- `sanitizeUser()` returns `id, name, email, role, createdAt, updatedAt`

---

### Products: `backend/src/routes/productRoutes.js`
**Base Path**: `/api/products`
1. `GET /api/products` - List products (search, category, pagination)
2. `GET /api/products/categories` - Unique category list
3. `GET /api/products/:id` - Single product
4. `POST /api/products` - Create product (admin only)
5. `PUT /api/products/:id` - Update product (admin only)
6. `DELETE /api/products/:id` - Delete product (admin only)

**Notes**:
- Search uses regex on `name` and `description`.
- Categories are sorted alphabetically.
- Create/Update require all fields except `image`.

---

### Orders: `backend/src/routes/orderRoutes.js`
**Base Path**: `/api/orders`
- All routes require authentication (`router.use(authenticate)`)

**User Routes**:
1. `POST /api/orders` - Create order
2. `GET /api/orders/my-orders` - User’s own orders
3. `GET /api/orders/:id` - Order details (user/admin)

**Admin Routes**:
4. `GET /api/orders/admin/all` - All orders
5. `PUT /api/orders/:id/status` - Update status

**Order Service Highlights**:
- Validates items and checks stock
- Decrements stock during order creation
- Stores product price snapshot per item
- Populates `items.product` and `user` in responses

---

### AI Assistant: `backend/src/routes/aiRoutes.js`
**Base Path**: `/api/ai`
1. `POST /api/ai/ask` - Ask AI question (authenticated)

**AI Service Highlights**:
- Uses Gemini when `GEMINI_API_KEY` is set
- If Gemini fails and `CHATGPT_API_KEY` exists, falls back to ChatGPT
- If Gemini not set but ChatGPT is set, uses ChatGPT directly
- If no AI keys are set, returns a demo response string
- Optional `productId` adds product context to the prompt

---

## Middleware & Validators

### Authentication Middleware: `backend/src/middlewares/authMiddleware.js`
- **`authenticate`**
  - Requires `Authorization: Bearer <token>`
  - Verifies JWT, loads user from DB
  - Returns 401 for missing/invalid/expired token
- **`authorizeRole('admin')`**
  - Returns 403 if user is not admin

### Validation Middleware: `backend/src/middlewares/validateRequest.js`
- Returns 400 with `errors` array when validation fails

### Error Handler: `backend/src/middlewares/errorHandler.js`
- Returns `{ success: false, message }`
- Adds stack trace in development mode

### Validators
- **Auth**: name (2-50), email (valid), password (min 6)
- **Product**: name (2-100), description (10-1000), price (>=0), category (2-50), stock (>=0), image optional URL
- **Order**: items array, productId (MongoId), quantity (>=1), shippingAddress fields required
- **AI**: question length 5-500, productId optional MongoId

---

## Complete API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Health Check
- **Endpoint**: `GET /api/health`
- **Auth**: Not required
- **Response**:
```json
{ "success": true, "message": "API is healthy" }
```

---

### Authentication
#### Register
`POST /api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response** (201):
```json
{
  "success": true,
  "user": { "id": "...", "name": "...", "email": "...", "role": "user" },
  "token": "..."
}
```

#### Login
`POST /api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response** (200):
```json
{
  "success": true,
  "user": { "id": "...", "name": "...", "email": "...", "role": "user" },
  "token": "..."
}
```

#### Current User
`GET /api/auth/me` (Bearer token required)
```json
{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }
```

---

### Products
#### Get All Products
`GET /api/products`
Query params: `search`, `category`, `page`, `limit`
```json
{
  "success": true,
  "products": [ ... ],
  "pagination": { "page": 1, "limit": 12, "total": 0, "pages": 0 }
}
```

#### Get Categories
`GET /api/products/categories`
```json
{ "success": true, "categories": ["Electronics", "Home"] }
```

#### Get Single Product
`GET /api/products/:id`
```json
{ "success": true, "product": { "_id": "...", "name": "..." } }
```

#### Create Product (Admin)
`POST /api/products`
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

#### Update Product (Admin)
`PUT /api/products/:id`
**All fields required** (same payload as create).

#### Delete Product (Admin)
`DELETE /api/products/:id`
**Response**:
```json
{ "success": true, "message": "Product deleted successfully" }
```

---

### Orders
#### Create Order
`POST /api/orders`
```json
{
  "items": [
    { "productId": "product_id_1", "quantity": 2 }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

#### Get My Orders
`GET /api/orders/my-orders`
Query params: `page`, `limit`
```json
{
  "success": true,
  "orders": [ ... ],
  "pagination": { "page": 1, "limit": 10, "total": 0, "pages": 0 }
}
```

#### Get Order Details
`GET /api/orders/:id`
```json
{ "success": true, "order": { "_id": "...", "items": [ ... ] } }
```

#### Get All Orders (Admin)
`GET /api/orders/admin/all`
Query params: `page`, `limit`, `status`
```json
{
  "success": true,
  "orders": [ ... ],
  "pagination": { "page": 1, "limit": 10, "total": 0, "pages": 0 }
}
```

#### Update Order Status (Admin)
`PUT /api/orders/:id/status`
```json
{ "status": "processing" }
```
Valid statuses: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

---

### AI Assistant
#### Ask AI Question
`POST /api/ai/ask`
```json
{
  "question": "What is this product good for?",
  "productId": "product_id" // optional
}
```
**Response**:
```json
{ "success": true, "response": "..." }
```

---

## Postman Testing Guide

### Environment Variables
- `base_url`: `http://localhost:5000/api`
- `admin_token`: set after admin login
- `user_token`: set after user login
- `product_id`: set after creating product
- `order_id`: set after creating order

### Suggested Test Order
1. Health check
2. Register user
3. Login admin
4. Create product
5. Get products + categories
6. Create order
7. Get my orders
8. Update order status (admin)
9. Ask AI question

---

## Error Scenarios & Responses

### Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

### Error Response Format
```json
{
  "success": false,
  "message": "Error message"
}
```

### Validation Error Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "msg": "Error message", "param": "fieldName", "location": "body" }
  ]
}
```

---

## Security & Operational Notes

1. **JWT Expiry**: 7 days.
2. **Role-Based Access**: Admin vs user via `authorizeRole`.
3. **CORS**: Locked to `CLIENT_ORIGIN` in `.env`.
4. **Stock Management**: Stock decreases at order creation.
5. **AI Safety**: API keys stay on backend; demo response when no keys configured.
6. **Admin Seeding**: Default admin created on startup if missing.

---

## Quick Reference

### Default Admin Credentials
- **Email**: `admin@example.com`
- **Password**: `admin123`

### Base URLs
- API: `http://localhost:5000/api`

### Token Format
```
Authorization: Bearer <token>
```

---

**End of Document**
