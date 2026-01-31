const Order = require('../models/Order');
const Product = require('../models/Product');

// Create new order (user only)
async function createOrder(userId, { items, shippingAddress }) {
  if (!items || items.length === 0) {
    const error = new Error('Order must have at least one item');
    error.status = 400;
    throw error;
  }

  let totalAmount = 0;
  const orderItems = [];

  // Validate each item and calculate total
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      const error = new Error(`Product ${item.productId} not found`);
      error.status = 404;
      throw error;
    }

    if (product.stock < item.quantity) {
      const error = new Error(`Insufficient stock for ${product.name}`);
      error.status = 400;
      throw error;
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price
    });

    // Update product stock
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress
  });

  // Populate product details for response
  // The following lines use Mongoose's `populate` method on the `order` document.
  // When an order is created, its 'items' field contains an array of subdocuments,
  // each referencing a product by its ObjectId. Similarly, the 'user' field contains
  // just a reference to the user's ObjectId.
  // 
  // By using `populate`, we replace these ObjectIds with actual data from the related
  // collections—Product and User. Here’s an explanation of each line:
  //
  // 1. await order.populate('items.product', 'name image');
  //    - This populates the 'product' field in each subdocument within the 'items' array.
  //    - Only the 'name' and 'image' fields of each product are loaded from the database and attached
  //      to the order document. This makes it easier to return complete and user-friendly order
  //      information (such as the product’s name and image) in the API response, rather than just product IDs.
  //
  // 2. await order.populate('user', 'name email');
  //    - This populates the 'user' field, replacing the reference (ObjectId) to the User document with
  //      the actual user's 'name' and 'email'. Again, this is useful to make the order information richer
  //      and more explicit in the response.
  //
  // Essentially, these two lines ensure the returned order object contains not just references, but also
  // basic details about the user and the products in the order, all loaded from their respective collections.

  await order.populate('items.product', 'name image');
  await order.populate('user', 'name email');

  return order;
}

// Get user's own orders
async function getUserOrders(userId, { page = 1, limit = 10 }) {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: userId })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ user: userId })
  ]);

  return {
    orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

// Get single order by ID (user can only see their own, admin can see any)
async function getOrderById(orderId, userId, userRole) {
  const order = await Order.findById(orderId)
    .populate('items.product', 'name image description')
    .populate('user', 'name email');

  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  // Users can only see their own orders, admins can see all
  if (userRole !== 'admin' && String(order.user._id) !== String(userId)) {
    const error = new Error('Access denied');
    error.status = 403;
    throw error;
  }

  return order;
}

// Get all orders (admin only)
async function getAllOrders({ page = 1, limit = 10, status }) {
  const query = {};
  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('items.product', 'name image')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(query)
  ]);

  return {
    orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

// Update order status (admin only)
async function updateOrderStatus(orderId, status) {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    const error = new Error('Invalid order status');
    error.status = 400;
    throw error;
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  )
    .populate('items.product', 'name image')
    .populate('user', 'name email');

  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  return order;
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
