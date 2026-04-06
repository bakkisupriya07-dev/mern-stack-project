const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
  try {
    const { restaurantId, restaurantName, items, totalAmount, deliveryAddress, paymentMethod } = req.body;
    if (!items?.length || !deliveryAddress) return res.status(400).json({ message: 'Missing required fields' });
    const order = await Order.create({ user: req.user._id, restaurantId, restaurantName, items, totalAmount, deliveryAddress, paymentMethod });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status || order.status;
    res.json(await order.save());
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
