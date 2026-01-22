const express = require('express');
const cors = require('cors');
const connectDb = require('./config/db');
const env = require('./config/env');
const seedAdmin = require('./utils/seedAdmin');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

env.ensureEnv();

// CORS configuration - allows frontend to communicate with backend
app.use(cors({
  origin: env.clientOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type'],
  optionsSuccessStatus: 204
}));

// Parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Connect to database and start server
connectDb()
  .then(async () => {
    // Seed admin user after DB connection
    await seedAdmin();

    app.listen(env.port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${env.port}`);
      console.log(`📍 Local: http://localhost:${env.port}`);
      console.log(`🌐 Network: http://0.0.0.0:${env.port}`);
      console.log(`🔗 CORS Origin: ${env.clientOrigin}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
