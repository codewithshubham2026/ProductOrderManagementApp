# Product & Order Management System

A complete MERN stack e-commerce application with product management, order processing, and AI-powered product assistant.

## 🎯 Project Overview

This is a production-ready MERN application designed for learning and real-world use. It includes:

- **User Authentication** - JWT-based authentication with role-based access (Admin/User)
- **Product Management** - Admin can create, update, delete products; Users can browse and search
- **Order Management** - Users create orders; Admin manages all orders and updates status
- **AI Integration** - Gemini AI assistant for product-related questions
- **Search & Filter** - Search products by name, filter by category
- **Pagination** - Efficient data loading with pagination

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React (Functional Components)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **AI**: Google Gemini API
- **Styling**: Custom CSS

## 📁 Project Structure

```
ProductOrderManagementApp/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & environment config
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── models/          # Database schemas (User, Product, Order)
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── validators/      # Input validation rules
│   │   └── server.js        # Entry point
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── context/         # Global state (AuthContext)
    │   ├── pages/           # Page components
    │   ├── api.js           # Axios configuration
    │   ├── App.jsx          # Main app & routing
    │   └── main.jsx         # React entry point
    ├── package.json
    └── .env
```

## 🚀 Local Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `env.example`):
```bash
cp env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/product_order_management
JWT_SECRET=your-secure-random-string-here
CLIENT_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User
GEMINI_API_KEY=your-gemini-api-key-here
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `env.example`):
```bash
cp env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔑 Default Admin Credentials

After starting the backend, a default admin user is created:
- **Email**: admin@example.com
- **Password**: admin123

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with search, filter, pagination)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create order (user only)
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### AI Assistant
- `POST /api/ai/ask` - Ask AI question about products

## 🎓 Learning Roadmap

### Step 1: Understanding the Backend Structure (Start Here)

**Files to read first:**
1. `backend/src/server.js` - Entry point, see how Express app is set up
2. `backend/src/config/db.js` - Database connection
3. `backend/src/config/env.js` - Environment variable management

**Why start here?**
- Understand how the application starts
- See how middleware is configured
- Learn how routes are organized

### Step 2: Authentication Flow

**Files to study:**
1. `backend/src/models/User.js` - User data structure
2. `backend/src/services/authService.js` - Registration and login logic
3. `backend/src/middlewares/authMiddleware.js` - JWT verification
4. `backend/src/routes/authRoutes.js` - Authentication endpoints

**Key concepts:**
- How passwords are hashed with bcrypt
- How JWT tokens are generated and verified
- How protected routes work

### Step 3: Product Management

**Files to study:**
1. `backend/src/models/Product.js` - Product schema
2. `backend/src/services/productService.js` - Product CRUD operations
3. `backend/src/controllers/productController.js` - Request handling
4. `backend/src/routes/productRoutes.js` - Product endpoints

**Key concepts:**
- How search and filtering work
- How pagination is implemented
- How admin-only routes are protected

### Step 4: Order Management

**Files to study:**
1. `backend/src/models/Order.js` - Order schema with nested items
2. `backend/src/services/orderService.js` - Order creation and management
3. How orders relate to products and users

**Key concepts:**
- How nested documents work in MongoDB
- How stock is updated when orders are created
- How role-based access control works

### Step 5: Frontend Architecture

**Files to study:**
1. `frontend/src/App.jsx` - Routing setup
2. `frontend/src/context/AuthContext.jsx` - Global authentication state
3. `frontend/src/api.js` - API client configuration
4. `frontend/src/components/ProtectedRoute.jsx` - Route protection

**Key concepts:**
- How React Context provides global state
- How protected routes redirect unauthenticated users
- How API calls are made with Axios

### Step 6: Frontend Pages

**Files to study:**
1. `frontend/src/pages/Products.jsx` - Product listing with search/filter
2. `frontend/src/pages/CreateOrder.jsx` - Order creation flow
3. `frontend/src/pages/AdminProducts.jsx` - Admin product management

**Key concepts:**
- How React hooks (useState, useEffect) manage component state
- How forms are handled
- How pagination works in the UI

### Step 7: AI Integration

**Files to study:**
1. `backend/src/services/aiService.js` - Gemini API integration
2. `frontend/src/pages/AIAssistant.jsx` - AI assistant UI

**Key concepts:**
- How external APIs are called from backend
- Why AI calls are made from backend (security)
- How product context is passed to AI

## 🧪 Safe Experiments for Beginners

1. **Add a new product field** (e.g., "brand")
   - Update `backend/src/models/Product.js`
   - Update `backend/src/validators/productValidators.js`
   - Update frontend forms

2. **Add order sorting**
   - Modify `backend/src/services/orderService.js`
   - Add sort parameter to API

3. **Add product reviews**
   - Create new Review model
   - Add review routes and controllers
   - Create review UI components

4. **Add email notifications**
   - Integrate email service (e.g., SendGrid)
   - Send email when order status changes

5. **Add product images upload**
   - Use Multer for file uploads
   - Store images in cloud storage (AWS S3, Cloudinary)

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment Summary

**Backend (Render/Railway):**
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

**Frontend (Vercel/Netlify):**
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set environment variables
5. Deploy

**Database:**
- Use MongoDB Atlas (free tier available)
- Update `MONGO_URI` in backend environment variables

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/product_order_management
JWT_SECRET=your-secure-random-string
CLIENT_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation on all endpoints
- CORS configuration
- Environment variable protection

## 📚 Additional Resources

### Comprehensive Guides
- **[BACKEND_COMPLETE_GUIDE.md](./BACKEND_COMPLETE_GUIDE.md)** - Complete backend flow, API documentation, and testing guide
- **[FRONTEND_COMPLETE_GUIDE.md](./FRONTEND_COMPLETE_GUIDE.md)** - Complete frontend flow, component breakdown, and user flows
- **[LEARNING_ROADMAP.md](./LEARNING_ROADMAP.md)** - Step-by-step learning path for beginners
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference with examples

### External Documentation
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [JWT.io](https://jwt.io/) - JWT token decoder
- [Gemini API Documentation](https://ai.google.dev/docs)

## 🤝 Contributing

This is a learning project. Feel free to:
- Add new features
- Improve UI/UX
- Fix bugs
- Optimize performance
- Add tests

## 📄 License

This project is open source and available for educational purposes.

---

**Happy Learning! 🎉**
