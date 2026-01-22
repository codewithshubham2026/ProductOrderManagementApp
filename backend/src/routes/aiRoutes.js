const express = require('express');
const { askQuestion } = require('../controllers/aiController');
const { authenticate } = require('../middlewares/authMiddleware');
const { aiQueryValidator } = require('../validators/aiValidators');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// AI assistant route - requires authentication
router.post('/ask', authenticate, aiQueryValidator, validateRequest, askQuestion);

module.exports = router;
