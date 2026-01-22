# Learning Roadmap

A step-by-step guide to understanding this MERN application from beginner to advanced.

## 🎯 Learning Goals

By the end of this roadmap, you will understand:
- How MERN stack applications work
- JWT authentication and authorization
- RESTful API design
- React state management
- Database relationships
- AI API integration
- Production deployment

## 📚 Phase 1: Backend Fundamentals (Week 1)

### Day 1-2: Project Setup & Structure

**Files to Read:**
1. `backend/src/server.js` - Start here! This is the entry point
2. `backend/src/config/db.js` - Database connection
3. `backend/src/config/env.js` - Environment variables

**What to Learn:**
- How Express server is initialized
- How middleware works (CORS, JSON parser)
- How routes are organized
- How environment variables are used

**Experiment:**
- Add a new route `/api/test` that returns "Hello World"
- Change the port number and see what happens

### Day 3-4: Database Models

**Files to Read:**
1. `backend/src/models/User.js`
2. `backend/src/models/Product.js`
3. `backend/src/models/Order.js`

**What to Learn:**
- Mongoose schemas
- Data types and validation
- Relationships between models (User → Order)
- Timestamps

**Experiment:**
- Add a new field to User model (e.g., `phone`)
- Create a new model (e.g., `Review`)
- Understand how `ref` works in Order model

### Day 5-7: Authentication

**Files to Read:**
1. `backend/src/services/authService.js` - Core authentication logic
2. `backend/src/middlewares/authMiddleware.js` - JWT verification
3. `backend/src/routes/authRoutes.js` - Authentication endpoints
4. `backend/src/utils/generateToken.js` - Token generation

**What to Learn:**
- Password hashing with bcrypt
- JWT token creation and verification
- How middleware protects routes
- Session vs token-based auth

**Experiment:**
- Change token expiration time
- Add a "remember me" feature
- Try accessing protected routes without token

## 📚 Phase 2: Core Features (Week 2)

### Day 8-10: Product Management

**Files to Read:**
1. `backend/src/services/productService.js` - Product business logic
2. `backend/src/controllers/productController.js` - Request handling
3. `backend/src/routes/productRoutes.js` - Product endpoints
4. `backend/src/validators/productValidators.js` - Input validation

**What to Learn:**
- CRUD operations (Create, Read, Update, Delete)
- Search and filtering
- Pagination implementation
- Input validation with express-validator

**Experiment:**
- Add a price range filter
- Implement product sorting (by price, name, date)
- Add product images upload

### Day 11-13: Order Management

**Files to Read:**
1. `backend/src/models/Order.js` - Order schema with nested items
2. `backend/src/services/orderService.js` - Order logic
3. `backend/src/controllers/orderController.js` - Order endpoints

**What to Learn:**
- Nested documents in MongoDB
- How orders relate to products and users
- Stock management when orders are created
- Role-based access control

**Experiment:**
- Add order cancellation logic
- Implement order refunds
- Add order status history

### Day 14: AI Integration

**Files to Read:**
1. `backend/src/services/aiService.js` - Gemini API integration
2. `backend/src/controllers/aiController.js` - AI endpoints

**What to Learn:**
- How to call external APIs from backend
- Why AI calls are made from backend (security)
- How to pass context to AI
- Error handling for external services

**Experiment:**
- Add different AI models
- Implement conversation history
- Add AI response caching

## 📚 Phase 3: Frontend Fundamentals (Week 3)

### Day 15-17: React Basics

**Files to Read:**
1. `frontend/src/App.jsx` - Main app component
2. `frontend/src/main.jsx` - React entry point
3. `frontend/src/components/NavBar.jsx` - Simple component
4. `frontend/src/pages/Login.jsx` - Form handling

**What to Learn:**
- React functional components
- useState and useEffect hooks
- Event handling
- Form submission

**Experiment:**
- Create a new component
- Add form validation
- Implement loading states

### Day 18-20: State Management & Routing

**Files to Read:**
1. `frontend/src/context/AuthContext.jsx` - Global state
2. `frontend/src/components/ProtectedRoute.jsx` - Route protection
3. `frontend/src/api.js` - API client

**What to Learn:**
- React Context API
- How to share state across components
- Protected routes
- Axios interceptors

**Experiment:**
- Add a Cart context
- Implement route transitions
- Add request/response logging

### Day 21: API Integration

**Files to Read:**
1. `frontend/src/pages/Products.jsx` - Fetching and displaying data
2. `frontend/src/pages/CreateOrder.jsx` - Creating resources
3. `frontend/src/pages/AdminProducts.jsx` - CRUD operations

**What to Learn:**
- How frontend calls backend APIs
- Error handling in React
- Loading states
- Optimistic updates

**Experiment:**
- Add error boundaries
- Implement retry logic
- Add request cancellation

## 📚 Phase 4: Advanced Concepts (Week 4)

### Day 22-24: Search, Filter & Pagination

**Files to Study:**
1. `backend/src/services/productService.js` - Search implementation
2. `frontend/src/pages/Products.jsx` - Frontend search UI

**What to Learn:**
- MongoDB query operators ($regex, $or)
- URL query parameters
- Pagination algorithms
- Debouncing search input

**Experiment:**
- Add advanced filters (price range, date range)
- Implement infinite scroll
- Add search suggestions

### Day 25-26: Error Handling

**Files to Study:**
1. `backend/src/middlewares/errorHandler.js` - Central error handling
2. `backend/src/middlewares/validateRequest.js` - Validation middleware
3. Frontend error handling in all pages

**What to Learn:**
- Centralized error handling
- Custom error classes
- User-friendly error messages
- Error logging

**Experiment:**
- Add error logging service
- Implement error notifications
- Add error recovery mechanisms

### Day 27-28: Security & Best Practices

**What to Learn:**
- Password security
- JWT token security
- CORS configuration
- Input sanitization
- SQL injection prevention (MongoDB is safe, but understand the concept)

**Experiment:**
- Add rate limiting
- Implement CSRF protection
- Add request validation

## 🧪 Practice Projects

### Beginner Projects

1. **Add Product Reviews**
   - Create Review model
   - Add review routes
   - Create review UI
   - Display average rating

2. **Add Shopping Cart**
   - Create cart context
   - Add to cart functionality
   - Cart persistence
   - Cart checkout

3. **Add User Profile**
   - Profile page
   - Update profile
   - Change password
   - Profile picture upload

### Intermediate Projects

1. **Add Email Notifications**
   - Send welcome email
   - Order confirmation email
   - Order status update emails

2. **Add Product Categories Management**
   - Category CRUD
   - Category hierarchy
   - Category-based navigation

3. **Add Order Tracking**
   - Tracking number generation
   - Status updates with timestamps
   - Tracking page

### Advanced Projects

1. **Add Payment Integration**
   - Stripe integration
   - Payment processing
   - Payment history

2. **Add Analytics Dashboard**
   - Sales analytics
   - Product performance
   - User analytics

3. **Add Real-time Features**
   - WebSocket integration
   - Real-time order updates
   - Live chat support

## 📖 Key Concepts Explained

### How JWT Authentication Works

1. User logs in with email/password
2. Backend verifies credentials
3. Backend generates JWT token (contains user ID)
4. Token sent to frontend
5. Frontend stores token in localStorage
6. Frontend sends token in Authorization header for protected requests
7. Backend verifies token and extracts user ID
8. Backend attaches user to request object

### How Products and Orders are Related

- **Product**: Standalone entity, can exist without orders
- **Order**: Contains array of order items
- **Order Item**: References a Product ID and stores quantity/price at time of order
- When order is created, product stock is decremented
- Order stores product price snapshot (price might change later)

### How Pagination Works

**Backend:**
1. Calculate `skip = (page - 1) * limit`
2. Query database with `.skip(skip).limit(limit)`
3. Count total documents
4. Return data + pagination info

**Frontend:**
1. Store current page in state
2. Send page number in API request
3. Display pagination controls
4. Update page state on click

### How Frontend Talks to Backend

1. User action triggers event (e.g., button click)
2. React component calls API function
3. Axios sends HTTP request to backend
4. Backend processes request
5. Backend sends JSON response
6. Frontend updates state with response
7. React re-renders UI

### How Gemini API is Integrated Safely

**Why Backend?**
- API keys must stay secret
- Frontend code is visible to users
- Backend can validate requests
- Backend can rate limit

**How it Works:**
1. User asks question in frontend
2. Frontend sends question to backend
3. Backend calls Gemini API with key
4. Backend processes response
5. Backend sends answer to frontend
6. Frontend displays answer

## 🎯 Learning Checklist

- [ ] Understand Express server setup
- [ ] Understand MongoDB schemas
- [ ] Understand JWT authentication
- [ ] Understand CRUD operations
- [ ] Understand React hooks
- [ ] Understand API integration
- [ ] Understand routing
- [ ] Understand state management
- [ ] Understand error handling
- [ ] Understand deployment

## 📚 Additional Resources

- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript reference
- [React Docs](https://react.dev/) - React documentation
- [Express Guide](https://expressjs.com/en/guide/routing.html) - Express routing
- [Mongoose Docs](https://mongoosejs.com/docs/) - MongoDB ODM
- [JWT.io](https://jwt.io/) - JWT debugger

## 🎓 Next Steps

After completing this roadmap:

1. **Build Your Own Project**
   - Apply what you learned
   - Choose a domain you're interested in
   - Start simple, add features gradually

2. **Learn Testing**
   - Unit tests
   - Integration tests
   - E2E tests

3. **Learn DevOps**
   - CI/CD pipelines
   - Docker
   - Kubernetes

4. **Learn Advanced Topics**
   - GraphQL
   - Microservices
   - Real-time applications
   - Performance optimization

---

**Remember:** Learning to code is a journey. Take your time, experiment, and don't be afraid to break things. That's how you learn! 🚀
