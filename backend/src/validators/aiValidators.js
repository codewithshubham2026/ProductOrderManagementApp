const { body } = require('express-validator');

// Validation rules for AI assistant queries
const aiQueryValidator = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Question must be between 5 and 500 characters'),
  body('productId')
    .optional()
    .isMongoId()
    .withMessage('Invalid product ID format')
];

module.exports = { aiQueryValidator };
