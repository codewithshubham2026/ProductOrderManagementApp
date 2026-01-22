const { validationResult } = require('express-validator');

// Validate request data using express-validator rules
// Returns 400 if validation fails
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
}

module.exports = validateRequest;
