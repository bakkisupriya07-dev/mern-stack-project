const express = require('express');
const router = express.Router();
const CustomOrder = require('../models/CustomOrder');
const { protect } = require('../middleware/authMiddleware');

// POST — place a custom order (items each carry their own customization)
router.post('/', protect, async (req, res) => {
  try {
    const { restaurantId, restaurantName, items, totalAmount, deliveryAddress, paymentMethod } = req.body;
    if (!items?.length || !deliveryAddress) return res.status(400).json({ message: 'Missing required fields' });
    const order = await CustomOrder.create({
      user: req.user._id, restaurantId, restaurantName,
      items, totalAmount, deliveryAddress, paymentMethod,
    });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET — all custom orders for current user
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await CustomOrder.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET — single custom order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await CustomOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT — update status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const order = await CustomOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status || order.status;
    res.json(await order.save());
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
