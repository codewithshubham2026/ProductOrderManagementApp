# Complete Backend Flow Explanation - Products & Orders

## Table of Contents
1. [Products Routes - Complete Flow](#products-routes-complete-flow)
2. [Orders Routes - Complete Flow](#orders-routes-complete-flow)
3. [Postman API Testing Guide](#postman-api-testing-guide)

---

## Products Routes - Complete Flow

### Architecture Flow
```
Request → Route → Middleware (Auth/Validation) → Controller → Service → Model → Database
                                                                    ↓
Response ← Route ← Controller ← Service ← Model ← Database
```

---

### 1. PRODUCT ROUTES FILE (`productRoutes.js`)

```1:27:backend/src/routes/productRoutes.js
const express = require('express');
const {
  getAllProducts,
  getProduct,
  getCategoriesList,
  create,
  update,
  remove
} = require('../controllers/productController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const { productValidator } = require('../validators/productValidators');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// Public routes - anyone can view products
router.get('/', getAllProducts);
router.get('/categories', getCategoriesList);
router.get('/:id', getProduct);

// Admin-only routes - require authentication and admin role
router.post('/', authenticate, authorizeRole('admin'), productValidator, validateRequest, create);
router.put('/:id', authenticate, authorizeRole('admin'), productValidator, validateRequest, update);
router.delete('/:id', authenticate, authorizeRole('admin'), remove);

module.exports = router;
```

**Line-by-Line Explanation:**

**Lines 1-9**: Import dependencies
- `express.Router()` creates a router instance
- Import controller functions (handlers)
- Import middleware: `authenticate` (checks JWT), `authorizeRole` (checks admin)
- Import validators and validation middleware

**Line 14**: Create router instance

**Lines 16-19**: Public routes (no authentication)
- `GET /api/products` → `getAllProducts` controller
- `GET /api/products/categories` → `getCategoriesList` controller
- `GET /api/products/:id` → `getProduct` controller

**Lines 21-24**: Admin-only routes (middleware chain)
- `POST /api/products`: 
  - `authenticate` → verifies JWT token
  - `authorizeRole('admin')` → checks if user is admin
  - `productValidator` → validates request body
  - `validateRequest` → checks validation results
  - `create` → controller function
- `PUT /api/products/:id`: Same middleware chain + `update` controller
- `DELETE /api/products/:id`: Auth + admin check + `remove` controller

---

### 2. PRODUCT CONTROLLER (`productController.js`)

Controllers handle HTTP requests/responses and call services.

```11:19:backend/src/controllers/productController.js
async function getAllProducts(req, res, next) {
  try {
    const { search, category, page, limit } = req.query;
    const result = await getProducts({ search, category, page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
```

**Line-by-Line:**
- **Line 13**: Extract query parameters from URL (`?search=laptop&category=Electronics&page=1&limit=10`)
- **Line 14**: Call service function with parameters
- **Line 15**: Send JSON response with `success: true` and service result
- **Line 17**: Pass errors to error handler middleware

```22:29:backend/src/controllers/productController.js
async function getProduct(req, res, next) {
  try {
    const product = await getProductById(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
}
```

**Line-by-Line:**
- **Line 24**: `req.params.id` extracts `:id` from URL (`/api/products/507f1f77bcf86cd799439011`)
- **Line 25**: Send product in response

```42:50:backend/src/controllers/productController.js
async function create(req, res, next) {
  try {
    const { name, description, price, category, stock, image } = req.body;
    const product = await createProduct({ name, description, price, category, stock, image });
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
}
```

**Line-by-Line:**
- **Line 44**: Extract data from request body (JSON)
- **Line 45**: Call service to create product
- **Line 46**: Return 201 (Created) status with new product

---

### 3. PRODUCT SERVICE (`productService.js`)

Services contain business logic and database operations.

```4:36:backend/src/services/productService.js
async function getProducts({ search, category, page = 1, limit = 10 }) {
  const query = {};

  // Search by product name or description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(query)
  ]);

  return {
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
}
```

**Line-by-Line:**
- **Line 5**: Initialize empty MongoDB query object
- **Lines 8-12**: If `search` exists, add `$or` condition
  - `$regex`: pattern matching
  - `$options: 'i'`: case-insensitive
  - Searches in `name` OR `description`
- **Lines 15-17**: If `category` exists, filter by category
- **Line 20**: Calculate skip value for pagination (page 2 with limit 10 = skip 10)
- **Lines 22-25**: Execute two queries in parallel:
  - Find products matching query, sorted by newest first, with pagination
  - Count total matching documents
- **Lines 27-35**: Return products array and pagination metadata

```38:47:backend/src/services/productService.js
async function getProductById(productId) {
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }
  return product;
}
```

**Line-by-Line:**
- **Line 40**: Find product by MongoDB `_id`
- **Lines 41-45**: If not found, create error with 404 status and throw it
- **Line 46**: Return product if found

```56:66:backend/src/services/productService.js
async function createProduct({ name, description, price, category, stock, image }) {
  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    image
  });
  return product;
}
```

**Line-by-Line:**
- **Line 57**: `Product.create()` creates new document in MongoDB
- Mongoose validates schema (required fields, min values, etc.)
- Returns created product with `_id` and timestamps

```69:86:backend/src/services/productService.js
async function updateProduct(productId, { name, description, price, category, stock, image }) {
  const product = await Product.findByIdAndUpdate(
    productId,
    { name, description, price, category, stock, image },
    // { new: true, runValidators: true } means:
    // - new: true --> Return the modified (updated) document instead of the original.
    // - runValidators: true --> Ensure the model's validation rules are applied when updating.
    { new: true, runValidators: true }
  );

  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }

  return product;
}
```

**Line-by-Line:**
- **Lines 70-76**: `findByIdAndUpdate()` updates document
  - First param: `productId` to find
  - Second param: fields to update
  - Third param: options
    - `new: true`: return updated document (not original)
    - `runValidators: true`: run schema validations
- **Lines 79-83**: If product not found, throw 404 error
- **Line 85**: Return updated product

---

### 4. PRODUCT VALIDATOR (`productValidators.js`)

```4:38:backend/src/validators/productValidators.js
const productValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('image')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image must be a valid URL')
];
```

**Line-by-Line:**
- Each `body()` validates a field from request body
- `.trim()` removes whitespace
- `.notEmpty()` ensures field exists
- `.withMessage()` custom error message
- `.isLength()`, `.isFloat()`, `.isInt()` type/length checks
- `.optional()` makes field optional (image)

---

## Orders Routes - Complete Flow

### Architecture Flow
```
Request → Route → authenticate → authorizeRole (if admin) → Validator → Controller → Service → Model → Database
                                                                                              ↓
Response ← Route ← Controller ← Service ← Model ← Database
```

---

### 1. ORDER ROUTES FILE (`orderRoutes.js`)

```1:28:backend/src/routes/orderRoutes.js
const express = require('express');
const {
  create,
  getMyOrders,
  getOrder,
  getAll,
  updateStatus
} = require('../controllers/orderController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const { createOrderValidator, updateOrderStatusValidator } = require('../validators/orderValidators');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.post('/', createOrderValidator, validateRequest, create);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);

// Admin-only routes
router.get('/admin/all', authorizeRole('admin'), getAll);
router.put('/:id/status', authorizeRole('admin'), updateOrderStatusValidator, validateRequest, updateStatus);

module.exports = router;
```

**Line-by-Line Explanation:**

**Line 16**: `router.use(authenticate)` applies authentication to ALL routes
- Every request must have valid JWT token
- `req.user` is set by `authenticate` middleware

**Lines 18-21**: User routes (authenticated users)
- `POST /api/orders`: Create order (validated)
- `GET /api/orders/my-orders`: Get user's orders
- `GET /api/orders/:id`: Get specific order

**Lines 23-24**: Admin-only routes
- `GET /api/orders/admin/all`: All orders (admin only)
- `PUT /api/orders/:id/status`: Update status (admin only)

---

### 2. ORDER CONTROLLER (`orderController.js`)

```10:18:backend/src/controllers/orderController.js
async function create(req, res, next) {
  try {
    const { items, shippingAddress } = req.body;
    const order = await createOrder(req.user._id, { items, shippingAddress });
    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
}
```

**Line-by-Line:**
- **Line 12**: Extract `items` and `shippingAddress` from request body
- **Line 13**: `req.user._id` comes from `authenticate` middleware (logged-in user's ID)
- Pass user ID and order data to service

```20:29:backend/src/controllers/orderController.js
async function getMyOrders(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await getUserOrders(req.user._id, { page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
```

**Line-by-Line:**
- **Line 23**: Get pagination params from query string
- **Line 24**: Pass user's ID to service (only their orders)

```32:39:backend/src/controllers/orderController.js
async function getOrder(req, res, next) {
  try {
    const order = await getOrderById(req.params.id, req.user._id, req.user.role);
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}
```

**Line-by-Line:**
- **Line 34**: Pass order ID, user ID, and user role
- Service checks: users see only their orders, admins see any

---

### 3. ORDER SERVICE (`orderService.js`)

**Most Complex Function: Create Order**

```5:56:backend/src/services/orderService.js
async function createOrder(userId, { items, shippingAddress }) {
  if (!items || items.length === 0) {
    const error = new Error('Order must have at least one item');
    error.status = 400;
    throw error;
  }

  let totalAmount = 0;
  const orderItems = [];

  // Validate each item and calculate total
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      const error = new Error(`Product ${item.productId} not found`);
      error.status = 404;
      throw error;
    }

    if (product.stock < item.quantity) {
      const error = new Error(`Insufficient stock for ${product.name}`);
      error.status = 400;
      throw error;
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price
    });

    // Update product stock
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress
  });

  // Populate product details for response
  await order.populate('items.product', 'name image');
  await order.populate('user', 'name email');

  return order;
}
```

**Line-by-Line Explanation:**

**Lines 6-10**: Validate items array exists and has at least one item

**Lines 12-13**: Initialize variables
- `totalAmount`: running total
- `orderItems`: array to store validated items

**Lines 15-42**: Loop through each item in order

**Line 17**: Find product by ID from database

**Lines 18-22**: If product doesn't exist, throw 404 error

**Lines 24-28**: Check if enough stock available
- Compare `product.stock` with `item.quantity`
- If insufficient, throw 400 error

**Lines 30-31**: Calculate item total and add to order total
- `itemTotal = price × quantity`
- `totalAmount += itemTotal`

**Lines 33-37**: Build order item object
- Store product ID (reference)
- Store quantity
- Store price snapshot (price may change later)

**Lines 39-41**: Decrease product stock and save
- `product.stock -= item.quantity`
- `await product.save()` writes to database

**Lines 44-49**: Create order in database
- `Order.create()` saves order with all items
- Includes user ID, items array, total, shipping address

**Lines 51-53**: Populate references for response
- `populate('items.product')` replaces product IDs with product objects
- `populate('user')` replaces user ID with user object
- Second param limits fields returned

**Line 55**: Return complete order with populated data

**Get User Orders:**

```59:80:backend/src/services/orderService.js
async function getUserOrders(userId, { page = 1, limit = 10 }) {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: userId })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ user: userId })
  ]);

  return {
    orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
}
```

**Line-by-Line:**
- **Line 60**: Calculate skip for pagination
- **Lines 62-68**: Find orders where `user` matches `userId`
  - Populate product details (name, image only)
  - Sort by newest first
  - Apply pagination
- **Line 69**: Count total orders for this user
- **Lines 71-79**: Return orders and pagination info

**Get Single Order (with Access Control):**

```83:102:backend/src/services/orderService.js
async function getOrderById(orderId, userId, userRole) {
  const order = await Order.findById(orderId)
    .populate('items.product', 'name image description')
    .populate('user', 'name email');

  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  // Users can only see their own orders, admins can see all
  if (userRole !== 'admin' && String(order.user._id) !== String(userId)) {
    const error = new Error('Access denied');
    error.status = 403;
    throw error;
  }

  return order;
}
```

**Line-by-Line:**
- **Lines 84-86**: Find order and populate product/user details
- **Lines 88-92**: If order not found, throw 404
- **Lines 94-99**: Access control check
  - If user is not admin AND order doesn't belong to user → 403 Forbidden
  - `String()` converts ObjectId to string for comparison
- **Line 101**: Return order if access granted

**Update Order Status (Admin Only):**

```135:158:backend/src/services/orderService.js
async function updateOrderStatus(orderId, status) {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    const error = new Error('Invalid order status');
    error.status = 400;
    throw error;
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  )
    .populate('items.product', 'name image')
    .populate('user', 'name email');

  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  return order;
}
```

**Line-by-Line:**
- **Lines 136-141**: Validate status is in allowed list
- **Lines 143-148**: Update order status
  - `findByIdAndUpdate()` updates status field
  - `new: true` returns updated document
  - Populate product and user details
- **Lines 150-154**: If order not found, throw 404
- **Line 156**: Return updated order

---

### 4. ORDER VALIDATOR (`orderValidators.js`)

```4:34:backend/src/validators/orderValidators.js
const createOrderValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must have at least one item'),
  body('items.*.productId')
    .notEmpty()
    .withMessage('Product ID is required for each item')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  body('items.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required for each item')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required')
];
```

**Line-by-Line:**
- **Line 5-7**: Validate `items` is array with at least 1 item
- **Lines 8-12**: `items.*.productId` validates ALL items in array
  - `.*` means "for each item in array"
  - Must be valid MongoDB ObjectId format
- **Lines 13-17**: Validate quantity for each item (min 1)
- **Lines 18-33**: Validate shipping address fields (all required)

---

## Postman API Testing Guide

### Setup

1. **Create Postman Environment**
   - Click "Environments" → "New"
   - Add variables:
     - `base_url`: `http://localhost:5000/api`
     - `admin_token`: (leave empty, set after login)
     - `user_token`: (leave empty, set after login)
     - `product_id`: (leave empty, set after creating product)
     - `order_id`: (leave empty, set after creating order)

2. **Select Environment** in dropdown (top right)

---

### Step-by-Step Testing Flow

#### Step 1: Health Check
**Request:**
- Method: `GET`
- URL: `{{base_url}}/health`
- Headers: None

**Expected Response (200):**
```json
{
  "success": true,
  "message": "API is healthy"
}
```

---

#### Step 2: Register User
**Request:**
- Method: `POST`
- URL: `{{base_url}}/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (201):**
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

**Action:** Copy `token` value → Set `user_token` variable in environment

---

#### Step 3: Login as Admin
**Request:**
- Method: `POST`
- URL: `{{base_url}}/auth/login`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Action:** Copy `token` → Set `admin_token` variable

---

#### Step 4: Create Product (Admin)
**Request:**
- Method: `POST`
- URL: `{{base_url}}/products`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{admin_token}}`
- Body:
```json
{
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM and SSD",
  "price": 999.99,
  "category": "Electronics",
  "stock": 50,
  "image": "https://example.com/laptop.jpg"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM and SSD",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50,
    "image": "https://example.com/laptop.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Action:** Copy `_id` → Set `product_id` variable

**Test Error Cases:**
- Missing field → 400 Validation Error
- Invalid price (negative) → 400
- Without admin token → 401 Unauthorized
- With user token (not admin) → 403 Forbidden

---

#### Step 5: Get All Products
**Request:**
- Method: `GET`
- URL: `{{base_url}}/products?page=1&limit=10`
- Headers: None (public route)

**Query Parameters:**
- `search`: Filter by name/description (e.g., `?search=laptop`)
- `category`: Filter by category (e.g., `?category=Electronics`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Expected Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Laptop",
      "price": 999.99,
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

---

#### Step 6: Get Categories
**Request:**
- Method: `GET`
- URL: `{{base_url}}/products/categories`
- Headers: None

**Expected Response (200):**
```json
{
  "success": true,
  "categories": ["Electronics", "Home", "Clothing"]
}
```

---

#### Step 7: Get Single Product
**Request:**
- Method: `GET`
- URL: `{{base_url}}/products/{{product_id}}`
- Headers: None

**Expected Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Laptop",
    ...
  }
}
```

**Test Error:** Invalid ID → 404 Not Found

---

#### Step 8: Update Product (Admin)
**Request:**
- Method: `PUT`
- URL: `{{base_url}}/products/{{product_id}}`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{admin_token}}`
- Body (ALL fields required):
```json
{
  "name": "Gaming Laptop",
  "description": "Updated description",
  "price": 1299.99,
  "category": "Electronics",
  "stock": 30,
  "image": "https://example.com/gaming-laptop.jpg"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Gaming Laptop",
    "price": 1299.99,
    "stock": 30,
    ...
  }
}
```

---

#### Step 9: Create Order (User)
**Request:**
- Method: `POST`
- URL: `{{base_url}}/orders`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{user_token}}`
- Body:
```json
{
  "items": [
    {
      "productId": "{{product_id}}",
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

**Expected Response (201):**
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439012",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "product": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Laptop",
          "image": "https://example.com/laptop.jpg"
        },
        "quantity": 2,
        "price": 999.99
      }
    ],
    "totalAmount": 1999.98,
    "status": "pending",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Action:** Copy `_id` → Set `order_id` variable

**Test Error Cases:**
- Insufficient stock → 400 "Insufficient stock for Laptop"
- Invalid productId → 404 "Product not found"
- Missing token → 401 Unauthorized
- Empty items array → 400 Validation Error

---

#### Step 10: Get My Orders (User)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/orders/my-orders?page=1&limit=10`
- Headers: `Authorization: Bearer {{user_token}}`

**Expected Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "items": [...],
      "totalAmount": 1999.98,
      "status": "pending",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

---

#### Step 11: Get Order Details
**Request:**
- Method: `GET`
- URL: `{{base_url}}/orders/{{order_id}}`
- Headers: `Authorization: Bearer {{user_token}}`

**Expected Response (200):**
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439012",
    "items": [
      {
        "product": {
          "name": "Laptop",
          "image": "...",
          "description": "..."
        },
        "quantity": 2,
        "price": 999.99
      }
    ],
    ...
  }
}
```

**Test Access Control:**
- User tries to access another user's order → 403 Forbidden
- Admin can access any order → 200 OK

---

#### Step 12: Get All Orders (Admin)
**Request:**
- Method: `GET`
- URL: `{{base_url}}/orders/admin/all?page=1&limit=10&status=pending`
- Headers: `Authorization: Bearer {{admin_token}}`

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status (optional: pending, processing, shipped, delivered, cancelled)

**Expected Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "...",
      "user": { "name": "John Doe", "email": "john@example.com" },
      "items": [...],
      "totalAmount": 1999.98,
      "status": "pending",
      ...
    }
  ],
  "pagination": { ... }
}
```

**Test Error:** User (not admin) tries to access → 403 Forbidden

---

#### Step 13: Update Order Status (Admin)
**Request:**
- Method: `PUT`
- URL: `{{base_url}}/orders/{{order_id}}/status`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{admin_token}}`
- Body:
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

**Expected Response (200):**
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "processing",
    ...
  }
}
```

**Test Error Cases:**
- Invalid status → 400 "Invalid order status"
- User (not admin) tries → 403 Forbidden

---

### Postman Collection Setup

**Create Collection:**
1. Click "Collections" → "New Collection"
2. Name: "Product Order Management API"

**Add Requests:**
- Create folders: "Auth", "Products", "Orders"
- Add each request above to appropriate folder
- Use environment variables (`{{base_url}}`, `{{admin_token}}`, etc.)

**Automation Script (for Login):**
In Login request → "Tests" tab:
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("admin_token", jsonData.token);
}
```

---

## Key Concepts Summary

### Middleware Chain Execution Order
1. **Route matches** → Express finds matching route
2. **authenticate** → Verifies JWT, sets `req.user`
3. **authorizeRole** → Checks if user has required role
4. **Validator** → Validates request body/params
5. **validateRequest** → Checks validation results
6. **Controller** → Handles request/response
7. **Service** → Business logic + database operations
8. **Error Handler** → Catches errors, sends response

### Database Operations
- **Create**: `Model.create({ ... })`
- **Read**: `Model.find()`, `Model.findById()`
- **Update**: `Model.findByIdAndUpdate(id, data, { new: true })`
- **Delete**: `Model.findByIdAndDelete(id)`
- **Populate**: Replace ObjectId references with actual documents

### Error Handling
- Services throw errors with `status` property
- Controllers use `next(error)` to pass to error handler
- Error handler sends JSON response with error message

---

**End of Detailed Explanation**
