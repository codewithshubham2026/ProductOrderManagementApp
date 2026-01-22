const { registerUser, loginUser, sanitizeUser } = require('../services/authService');

// Handle user registration
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const result = await registerUser({ name, email, password });
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

// Handle user login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

// Get current authenticated user info
async function me(req, res) {
  const safeUser = sanitizeUser(req.user);
  res.json({ success: true, user: safeUser });
}

module.exports = { register, login, me };
