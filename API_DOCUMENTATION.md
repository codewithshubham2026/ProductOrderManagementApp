# API Documentation

Complete API reference for the Product & Order Management System.

## Base URL

**Local Development:** `http://localhost:5000/api`

**Production:** `https://your-backend-url.onrender.com/api`

## Authentication

Most endpoints require authentication. Include JWT token in request header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

**Validation:**
- `name`: 2-50 characters
- `email`: Valid email format
- `password`: Minimum 6 characters

---

### Login User

**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

---

### Get Current User

**GET** `/auth/me`

Get authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Product Endpoints

### Get All Products

**GET** `/products`

Get paginated list of products with search and filter.

**Query Parameters:**
- `search` (optional): Search in name/description
- `category` (optional): Filter by category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:**
```
GET /products?search=laptop&category=Electronics&page=1&limit=12
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "_id": "product_id",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 999.99,
      "category": "Electronics",
      "stock": 50,
      "image": "https://example.com/image.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

---

### Get Product Categories

**GET** `/products/categories`

Get all unique product categories.

**Response:**
```json
{
  "success": true,
  "categories": ["Electronics", "Clothing", "Books"]
}
```

---

### Get Single Product

**GET** `/products/:id`

Get product by ID.

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "product_id",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50,
    "image": "https://example.com/image.jpg"
  }
}
```

---

### Create Product (Admin Only)

**POST** `/products`

Create a new product.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description here",
  "price": 99.99,
  "category": "Electronics",
  "stock": 100,
  "image": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "product_id",
    "name": "New Product",
    ...
  }
}
```

**Validation:**
- `name`: 2-100 characters
- `description`: 10-1000 characters
- `price`: Positive number
- `category`: 2-50 characters
- `stock`: Non-negative integer
- `image`: Valid URL (optional)

---

### Update Product (Admin Only)

**PUT** `/products/:id`

Update existing product.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:** (same as create, all fields optional)

**Response:**
```json
{
  "success": true,
  "product": { ... }
}
```

---

### Delete Product (Admin Only)

**DELETE** `/products/:id`

Delete a product.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Order Endpoints

### Create Order (User Only)

**POST** `/orders`

Create a new order.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product_id_1",
      "quantity": 2
    },
    {
      "productId": "product_id_2",
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

**Response:**
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "image": "https://..."
        },
        "quantity": 2,
        "price": 99.99
      }
    ],
    "totalAmount": 199.98,
    "status": "pending",
    "shippingAddress": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation:**
- `items`: Array with at least one item
- `items[].productId`: Valid MongoDB ObjectId
- `items[].quantity`: Integer >= 1
- `shippingAddress`: All fields required

---

### Get User Orders

**GET** `/orders/my-orders`

Get authenticated user's orders.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "orders": [ ... ],
  "pagination": { ... }
}
```

---

### Get Order Details

**GET** `/orders/:id`

Get order by ID. Users can only see their own orders. Admins can see any order.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [ ... ],
    "totalAmount": 199.98,
    "status": "pending",
    "shippingAddress": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get All Orders (Admin Only)

**GET** `/orders/admin/all`

Get all orders in the system.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "orders": [ ... ],
  "pagination": { ... }
}
```

---

### Update Order Status (Admin Only)

**PUT** `/orders/:id/status`

Update order status.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "processing"
}
```

**Valid Statuses:**
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

**Response:**
```json
{
  "success": true,
  "order": { ... }
}
```

---

## AI Assistant Endpoints

### Ask AI Question

**POST** `/ai/ask`

Ask AI assistant about products.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "question": "What are the features of this product?",
  "productId": "product_id" // optional
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI response text here..."
}
```

**Validation:**
- `question`: 5-500 characters
- `productId`: Valid MongoDB ObjectId (optional)

---

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting implemented. For production, consider adding rate limiting to prevent abuse.

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products?page=1&limit=10
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items":[{"productId":"product_id","quantity":2}],
    "shippingAddress":{
      "street":"123 Main St",
      "city":"New York",
      "state":"NY",
      "zipCode":"10001"
    }
  }'
```

---

**Note:** Replace `YOUR_TOKEN` with actual JWT token from login response.
