const Product = require('../models/Product');

// Get all products with search, filter, and pagination
async function getProducts({ search, category, page = 1, limit = 10 }) {
  const query = {};

  // Search by product name or description
  // This block checks if a "search" term was provided.
  // If yes, we want to find all products where either the name or the description
  // contains the search term (for example, searching "phone" could find products named "Smartphone" or
  // with descriptions like "the best phone ever").
  // The "$regex" part means "look for this text anywhere in the field".
  // The "$options: 'i'" part makes the search case-insensitive (so searching "laptop"
  // will match "Laptop", "lApToP", etc).
  //
  // "$or" means "either of these conditions should match":
  //   1. The "name" field has the search text
  //   2. The "description" field has the search text
  //
  // Putting this on the "query" means only matching products will be returned from the database.
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

  // Fetch the list of products AND the total number of matching products at the same time:
  // - Product.find(query) searches for products that match our query.
  //     - .sort({ createdAt: -1 }) orders the products so the newest (most recently created) appear first.
  //     - .skip(skip) skips a number of products depending on the page (for pagination).
  //     - .limit(limit) restricts how many products are returned (for pagination).
  // - Product.countDocuments(query) counts how many products match our query in total (needed for pagination metadata).
  // By wrapping both in Promise.all, we execute these two database calls in parallel, which is more efficient.
  // After both calls finish, "products" will be the array of products for this page, and "total" will be the total number of matches.
  const [products, total] = await Promise.all([
    Product.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)              // Skip documents for previous pages
      .limit(limit),           // Limit to the number of products per page
    Product.countDocuments(query) // Count all documents that match the query
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
  // This line gets all unique values of the "category" field from the products collection.
  // "Product.distinct('category')" asks MongoDB to look at every product document,
  // collects the value of the "category" field from each one, removes duplicates,
  // and returns an array of the unique categories present. For example,
  // if you have products in categories "Electronics", "Home", and "Clothing",
  // you'll get: ["Electronics", "Home", "Clothing"].
  const categories = await Product.distinct('category');
  return categories.sort(); // Sort categories alphabetically
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
    // { new: true, runValidators: true } means:
    // - new: true --> Return the modified (updated) document instead of the original.
    // - runValidators: true --> Ensure the model's validation rules are applied when updating.
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
