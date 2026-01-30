# Postman API Testing Guide

## Base Configuration

**Base URL:** `http://localhost:5000`  
**API Prefix:** `/api`

---

## 1. Health Check

### GET /api/health
**Description:** Check if API is running  
**Auth Required:** No

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/health`
- Headers: None

**Expected Response:**
```json
{
  "success": true,
  "message": "API is healthy"
}
```

---

## 2. Authentication Endpoints

### 2.1 Register User
**POST /api/auth/register**  
**Description:** Register a new user  
**Auth Required:** No

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/register`
- Headers:
  - `Content-Type: application/json`
- Body (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Expected Response (201):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2.2 Login User
**POST /api/auth/login**  
**Description:** Login and get JWT token  
**Auth Required:** No

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/login`
- Headers:
  - `Content-Type: application/json`
- Body (JSON):
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required

**Expected Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** Save the `token` from response for authenticated requests.

---

### 2.3 Get Current User
**GET /api/auth/me**  
**Description:** Get current authenticated user info  
**Auth Required:** Yes

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/auth/me`
- Headers:
  - `Authorization: Bearer <token>`

**Expected Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 3. Product Endpoints

### 3.1 Get All Products
**GET /api/products**  
**Description:** Get all products with search, filter, and pagination  
**Auth Required:** No

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/products`
- Query Parameters (optional):
  - `search`: Search term (searches in name/description)
  - `category`: Filter by category
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

**Example URLs:**
- `http://localhost:5000/api/products`
- `http://localhost:5000/api/products?search=laptop&page=1&limit=5`
- `http://localhost:5000/api/products?category=Electronics&page=2`

**Expected Response (200):**
```json
{
  "success": true,
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### 3.2 Get Product by ID
**GET /api/products/:id**  
**Description:** Get single product details  
**Auth Required:** No

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/products/<product_id>`
- Replace `<product_id>` with actual MongoDB ObjectId

**Example:**
- `http://localhost:5000/api/products/507f1f77bcf86cd799439011`

**Expected Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "...",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics",
    "stock": 100,
    "image": "https://example.com/image.jpg",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 3.3 Get Categories List
**GET /api/products/categories**  
**Description:** Get all available product categories  
**Auth Required:** No

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/products/categories`

**Expected Response (200):**
```json
{
  "success": true,
  "categories": ["Electronics", "Clothing", "Books", ...]
}
```

---

### 3.4 Create Product (Admin Only)
**POST /api/products**  
**Description:** Create a new product  
**Auth Required:** Yes (Admin role)

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/api/products`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <admin_token>`
- Body (JSON):
```json
{
  "name": "New Product",
  "description": "Product description here (min 10 chars)",
  "price": 99.99,
  "category": "Electronics",
  "stock": 100,
  "image": "https://example.com/image.jpg"
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters
- `description`: Required, 10-1000 characters
- `price`: Required, positive number
- `category`: Required, 2-50 characters
- `stock`: Required, non-negative integer
- `image`: Optional, valid URL

**Expected Response (201):**
```json
{
  "success": true,
  "product": {
    "_id": "...",
    "name": "New Product",
    "description": "Product description here",
    "price": 99.99,
    "category": "Electronics",
    "stock": 100,
    "image": "https://example.com/image.jpg",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 3.5 Update Product (Admin Only)
**PUT /api/products/:id**  
**Description:** Update existing product  
**Auth Required:** Yes (Admin role)

**Request:**
- Method: `PUT`
- URL: `http://localhost:5000/api/products/<product_id>`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <admin_token>`
- Body (JSON): Same as Create Product

**Expected Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "...",
    "name": "Updated Product",
    ...
  }
}
```

---

### 3.6 Delete Product (Admin Only)
**DELETE /api/products/:id**  
**Description:** Delete a product  
**Auth Required:** Yes (Admin role)

**Request:**
- Method: `DELETE`
- URL: `http://localhost:5000/api/products/<product_id>`
- Headers:
  - `Authorization: Bearer <admin_token>`

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 4. Order Endpoints

**Note:** All order endpoints require authentication.

### 4.1 Create Order
**POST /api/orders**  
**Description:** Create a new order  
**Auth Required:** Yes

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/api/orders`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- Body (JSON):
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2
    },
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 1
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

**Validation Rules:**
- `items`: Required, array with at least 1 item
- `items[].productId`: Required, valid MongoDB ObjectId
- `items[].quantity`: Required, integer >= 1
- `shippingAddress.street`: Required
- `shippingAddress.city`: Required
- `shippingAddress.state`: Required
- `shippingAddress.zipCode`: Required

**Expected Response (201):**
```json
{
  "success": true,
  "order": {
    "_id": "...",
    "user": "...",
    "items": [
      {
        "product": {
          "_id": "...",
          "name": "Product Name",
          "image": "..."
        },
        "quantity": 2,
        "price": 99.99
      }
    ],
    "totalAmount": 199.98,
    "status": "pending",
    "shippingAddress": {...},
    "createdAt": "..."
  }
}
```

---

### 4.2 Get My Orders
**GET /api/orders/my-orders**  
**Description:** Get current user's orders with pagination  
**Auth Required:** Yes

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/orders/my-orders`
- Headers:
  - `Authorization: Bearer <token>`
- Query Parameters (optional):
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

**Example:**
- `http://localhost:5000/api/orders/my-orders?page=1&limit=10`

**Expected Response (200):**
```json
{
  "success": true,
  "orders": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

---

### 4.3 Get Order by ID
**GET /api/orders/:id**  
**Description:** Get single order details (user can only see their own orders, admin can see all)  
**Auth Required:** Yes

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/orders/<order_id>`
- Headers:
  - `Authorization: Bearer <token>`

**Expected Response (200):**
```json
{
  "success": true,
  "order": {
    "_id": "...",
    "user": {...},
    "items": [...],
    "totalAmount": 199.98,
    "status": "pending",
    "shippingAddress": {...},
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 4.4 Get All Orders (Admin Only)
**GET /api/orders/admin/all**  
**Description:** Get all orders with pagination and status filter  
**Auth Required:** Yes (Admin role)

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/orders/admin/all`
- Headers:
  - `Authorization: Bearer <admin_token>`
- Query Parameters (optional):
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `status`: Filter by status (pending, processing, shipped, delivered, cancelled)

**Example:**
- `http://localhost:5000/api/orders/admin/all?status=pending&page=1&limit=10`

**Expected Response (200):**
```json
{
  "success": true,
  "orders": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### 4.5 Update Order Status (Admin Only)
**PUT /api/orders/:id/status**  
**Description:** Update order status  
**Auth Required:** Yes (Admin role)

**Request:**
- Method: `PUT`
- URL: `http://localhost:5000/api/orders/<order_id>/status`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <admin_token>`
- Body (JSON):
```json
{
  "status": "shipped"
}
```

**Validation Rules:**
- `status`: Required, must be one of: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

**Expected Response (200):**
```json
{
  "success": true,
  "order": {
    "_id": "...",
    "status": "shipped",
    ...
  }
}
```

---

## 5. AI Assistant Endpoints

### 5.1 Ask Question
**POST /api/ai/ask**  
**Description:** Ask AI assistant a question about products  
**Auth Required:** Yes

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/api/ai/ask`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- Body (JSON):
```json
{
  "question": "What are the best products for home office?",
  "productId": "507f1f77bcf86cd799439011"
}
```

**Validation Rules:**
- `question`: Required, 5-500 characters
- `productId`: Optional, valid MongoDB ObjectId

**Expected Response (200):**
```json
{
  "success": true,
  "response": "AI generated response here..."
}
```

---

## Postman Collection Setup

### Environment Variables

Create a Postman environment with these variables:

1. **base_url**: `http://localhost:5000`
2. **token**: (will be set after login)
3. **admin_token**: (will be set after admin login)
4. **user_id**: (will be set after registration/login)
5. **product_id**: (will be set after creating a product)
6. **order_id**: (will be set after creating an order)

### Pre-request Scripts

For authenticated endpoints, use this in Pre-request Script:
```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('token')
});
```

### Test Scripts

After login/register, save token:
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const jsonData = pm.response.json();
    if (jsonData.token) {
        pm.environment.set('token', jsonData.token);
    }
}
```

---

## Testing Workflow

### 1. Initial Setup
1. Start the backend server
2. Test Health Check: `GET /api/health`

### 2. Authentication Flow
1. Register a new user: `POST /api/auth/register`
2. Login: `POST /api/auth/login` (save token)
3. Get current user: `GET /api/auth/me`

### 3. Product Testing (Public)
1. Get all products: `GET /api/products`
2. Get categories: `GET /api/products/categories`
3. Get product by ID: `GET /api/products/:id`

### 4. Product Testing (Admin)
1. Login as admin (use default admin credentials)
2. Create product: `POST /api/products`
3. Update product: `PUT /api/products/:id`
4. Delete product: `DELETE /api/products/:id`

### 5. Order Testing
1. Create order: `POST /api/orders`
2. Get my orders: `GET /api/orders/my-orders`
3. Get order by ID: `GET /api/orders/:id`

### 6. Admin Order Testing
1. Get all orders: `GET /api/orders/admin/all`
2. Update order status: `PUT /api/orders/:id/status`

### 7. AI Assistant Testing
1. Ask question: `POST /api/ai/ask`

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## Notes

1. **JWT Token**: Tokens are returned in login/register responses. Include them in the `Authorization` header as `Bearer <token>`.

2. **Admin Access**: Default admin credentials are set via environment variables:
   - `ADMIN_EMAIL` (default: admin@example.com)
   - `ADMIN_PASSWORD` (default: admin123)

3. **MongoDB ObjectIds**: Product IDs and Order IDs are MongoDB ObjectIds (24 character hex strings).

4. **Pagination**: Default page size is 10. Use `page` and `limit` query parameters to control pagination.

5. **CORS**: API accepts requests from `CLIENT_ORIGIN` (default: http://localhost:5173).
