const Product = require('../models/Product');

// Get all products with search, filter, and pagination
async function getProducts({ search, category, page = 1, limit = 10 }) {
  const query = {};

  // Search by product name or description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(query)
  ]);

  return {
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

// Get single product by ID
async function getProductById(productId) {
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }
  return product;
}

// Get all unique categories for filter dropdown
async function getCategories() {
  const categories = await Product.distinct('category');
  return categories.sort();
}

// Create new product (admin only)
async function createProduct({ name, description, price, category, stock, image }) {
  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    image
  });
  return product;
}

// Update existing product (admin only)
async function updateProduct(productId, { name, description, price, category, stock, image }) {
  const product = await Product.findByIdAndUpdate(
    productId,
    { name, description, price, category, stock, image },
    { new: true, runValidators: true }
  );

  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }

  return product;
}

// Delete product (admin only)
async function deleteProduct(productId) {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }
  return product;
}

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
};
