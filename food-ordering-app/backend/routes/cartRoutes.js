const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const { protect } = require('../middleware/authMiddleware');

// GET cart validation — verify items still exist and prices are current
router.post('/validate', protect, async (req, res) => {
  try {
    const { items } = req.body;
    const validated = [];
    for (const item of items) {
      const restaurant = await Restaurant.findById(item.restaurantId);
      if (!restaurant) continue;
      const menuItem = restaurant.menu.id(item.menuItemId);
      if (!menuItem) continue;
      validated.push({ ...item, currentPrice: menuItem.price });
    }
    res.json(validated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
