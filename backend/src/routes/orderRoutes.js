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
