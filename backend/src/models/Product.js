const mongoose = require('mongoose');

// Product schema: stores product information
// Admin can create/update/delete products
// Users can view and search products
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

// Index for faster search queries
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
