const {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../services/productService');

// Get all products with search, filter, and pagination
async function getAllProducts(req, res, next) {
  try {
    const { search, category, page, limit } = req.query;
    const result = await getProducts({ search, category, page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

// Get single product by ID
async function getProduct(req, res, next) {
  try {
    const product = await getProductById(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

// Get all categories
async function getCategoriesList(req, res, next) {
  try {
    const categories = await getCategories();
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
}

// Create new product (admin only)
async function create(req, res, next) {
  try {
    const { name, description, price, category, stock, image } = req.body;
    const product = await createProduct({ name, description, price, category, stock, image });
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

// Update product (admin only)
async function update(req, res, next) {
  try {
    const { name, description, price, category, stock, image } = req.body;
    const product = await updateProduct(req.params.id, { name, description, price, category, stock, image });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

// Delete product (admin only)
async function remove(req, res, next) {
  try {
    await deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProduct,
  getCategoriesList,
  create,
  update,
  remove
};
