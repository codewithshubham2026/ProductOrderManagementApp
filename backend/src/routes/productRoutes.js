const express = require('express');
const {
  getAllProducts,
  getProduct,
  getCategoriesList,
  create,
  update,
  remove
} = require('../controllers/productController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const { productValidator } = require('../validators/productValidators');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// Public routes - anyone can view products
router.get('/', getAllProducts);
router.get('/categories', getCategoriesList);
router.get('/:id', getProduct);

// Admin-only routes - require authentication and admin role
router.post('/', authenticate, authorizeRole('admin'), productValidator, validateRequest, create);
router.put('/:id', authenticate, authorizeRole('admin'), productValidator, validateRequest, update);
router.delete('/:id', authenticate, authorizeRole('admin'), remove);

module.exports = router;
