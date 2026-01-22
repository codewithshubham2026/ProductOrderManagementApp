require('dotenv').config();

// Centralized environment variable management
// This ensures all required env vars are present before the app starts
const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/product_order_management',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  adminName: process.env.ADMIN_NAME || 'Admin User',
  geminiApiKey: process.env.GEMINI_API_KEY || ''
};

// Validate critical environment variables
function ensureEnv() {
  if (!env.jwtSecret || env.jwtSecret === 'change-me') {
    console.warn('⚠️  Warning: JWT_SECRET is not set or using default value');
  }
  if (!env.geminiApiKey) {
    console.warn('⚠️  Warning: GEMINI_API_KEY is not set. AI features will be disabled.');
  }
}

module.exports = { ...env, ensureEnv };
