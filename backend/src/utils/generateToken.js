const jwt = require('jsonwebtoken');
const env = require('../config/env');

// Generate JWT token for authenticated users
// Token contains user ID and expires in 7 days
function generateToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: '7d' });
}

module.exports = generateToken;
