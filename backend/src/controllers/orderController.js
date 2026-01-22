const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../services/orderService');

// Create new order (user only)
async function create(req, res, next) {
  try {
    const { items, shippingAddress } = req.body;
    const order = await createOrder(req.user._id, { items, shippingAddress });
    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

// Get current user's orders
async function getMyOrders(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await getUserOrders(req.user._id, { page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

// Get single order by ID
async function getOrder(req, res, next) {
  try {
    const order = await getOrderById(req.params.id, req.user._id, req.user.role);
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

// Get all orders (admin only)
async function getAll(req, res, next) {
  try {
    const { page, limit, status } = req.query;
    const result = await getAllOrders({ page, limit, status });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

// Update order status (admin only)
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  getMyOrders,
  getOrder,
  getAll,
  updateStatus
};
