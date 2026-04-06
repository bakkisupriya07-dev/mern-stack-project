const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// GET all restaurants (with optional search/cuisine filter)
router.get('/', async (req, res) => {
  try {
    const { search, cuisine } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (cuisine) query.cuisine = cuisine;
    const restaurants = await Restaurant.find(query).select('-menu');
    res.json(restaurants);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single restaurant with full menu + customization options
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create restaurant
router.post('/', async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST seed sample restaurants with per-item customizations
router.post('/seed/data', async (req, res) => {
  try {
    await Restaurant.deleteMany({});

    const restaurants = [
      // ─────────────────────────────────────────────
      // SPICE GARDEN — Indian
      // ─────────────────────────────────────────────
      {
        name: 'Spice Garden', cuisine: 'Indian', emoji: '🍛',
        description: 'Authentic Indian cuisine with bold, aromatic flavours',
        rating: 4.5, deliveryTime: '30-40 min', minOrder: 150,
        color: '#FF6B35', tag: 'Best Seller',
        menu: [
          {
            name: 'Butter Chicken', emoji: '🍗', price: 280,
            category: 'Main Course', isVeg: false,
            description: 'Tender chicken in rich, creamy tomato-cashew curry',
            customization: {
              spiceLevels:    ['No Spice', 'Mild', 'Medium', 'Spicy', 'Extra Spicy'],
              gravyOptions:   ['Light Gravy', 'Normal Gravy', 'Extra Gravy'],
              portionOptions: ['Half Portion', 'Full Portion', 'Double Portion (+₹200)'],
              addOnOptions: [
                { name: 'Extra Cream',       price: 30  },
                { name: 'Charcoal Smoked',   price: 50  },
                { name: 'Bone-in Chicken',   price: 40  },
                { name: 'Extra Chicken',     price: 80  },
                { name: 'Garlic Butter Naan',price: 60  },
              ],
              removableItems: ['Cashew Paste', 'Cream', 'Fenugreek Leaves', 'Butter'],
            },
          },
          {
            name: 'Paneer Tikka', emoji: '🧀', price: 220,
            category: 'Starter', isVeg: true,
            description: 'Grilled cottage cheese with bell peppers in spiced marinade',
            customization: {
              spiceLevels:       ['Mild', 'Medium', 'Spicy', 'Extra Spicy'],
              marinationOptions: ['Classic Yogurt', 'Achari (Pickle)', 'Hariyali (Green)', 'Afghani (Cream)'],
              cookStyleOptions:  ['Tandoor', 'Pan Grilled', 'Air Fried'],
              portionOptions:    ['Half (6 pcs)', 'Full (12 pcs)', 'Double (24 pcs) (+₹180)'],
              addOnOptions: [
                { name: 'Extra Paneer',   price: 60 },
                { name: 'Bell Peppers',   price: 20 },
                { name: 'Mint Chutney',   price: 15 },
                { name: 'Onion Rings',    price: 20 },
              ],
              removableItems: ['Onion', 'Bell Pepper', 'Chaat Masala', 'Lemon'],
            },
          },
          {
            name: 'Dum Biryani', emoji: '🍚', price: 320,
            category: 'Main Course', isVeg: false,
            description: 'Slow-cooked aromatic basmati rice layered with spiced meat',
            customization: {
              spiceLevels:    ['Mild', 'Medium', 'Spicy'],
              proteinOptions: ['Chicken', 'Mutton (+₹60)', 'Egg', 'Vegetable'],
              portionOptions: ['Regular', 'Large (+₹60)', 'Party Pack (+₹150)'],
              addOnOptions: [
                { name: 'Extra Raita',   price: 20 },
                { name: 'Mirchi Salan',  price: 30 },
                { name: 'Extra Meat',    price: 80 },
                { name: 'Boiled Egg',    price: 20 },
              ],
              removableItems: ['Fried Onions', 'Mint Leaves', 'Saffron', 'Raisins', 'Cashews'],
            },
          },
          {
            name: 'Garlic Naan', emoji: '🫓', price: 60,
            category: 'Breads', isVeg: true,
            description: 'Soft leavened flatbread with garlic butter, baked in tandoor',
            customization: {
              breadTypeOptions: ['Plain Naan', 'Garlic Naan', 'Butter Garlic Naan', 'Cheese Naan (+₹30)', 'Stuffed Paneer Naan (+₹50)', 'Kulcha'],
              countOptions:     ['1 piece', '2 pieces (+₹55)', '4 pieces (+₹165)', '6 pieces (+₹240)'],
              addOnOptions: [
                { name: 'Extra Butter',      price: 10 },
                { name: 'Coriander Topping', price: 5  },
                { name: 'Cheese Spread',     price: 25 },
              ],
              removableItems: ['Garlic', 'Coriander', 'Butter'],
            },
          },
          {
            name: 'Dal Makhani', emoji: '🫘', price: 180,
            category: 'Main Course', isVeg: true,
            description: 'Slow-cooked black lentils in creamy tomato-butter gravy',
            customization: {
              spiceLevels:  ['Mild', 'Medium', 'Spicy'],
              gravyOptions: ['Normal', 'Extra Creamy', 'Dhaba Style'],
              addOnOptions: [
                { name: 'Extra Cream',  price: 25 },
                { name: 'Tadka (Tempering)', price: 20 },
              ],
              removableItems: ['Cream', 'Butter', 'Ginger'],
            },
          },
          {
            name: 'Mango Lassi', emoji: '🥭', price: 80,
            category: 'Drinks', isVeg: true,
            description: 'Refreshing blended yoghurt and mango drink',
            customization: {
              sweetnessOptions:   ['Less Sweet', 'Normal', 'Extra Sweet'],
              sizeOptionsD:       ['Regular (300ml)', 'Large (500ml) (+₹40)'],
              temperatureOptions: ['Chilled', 'Room Temperature'],
              addOnOptions: [
                { name: 'Chia Seeds',    price: 20 },
                { name: 'Dry Fruits',    price: 30 },
              ],
              removableItems: ['Sugar', 'Rose Water', 'Cardamom'],
            },
          },
        ],
      },

      // ─────────────────────────────────────────────
      // BURGER BAY — American
      // ─────────────────────────────────────────────
      {
        name: 'Burger Bay', cuisine: 'American', emoji: '🍔',
        description: 'Juicy burgers, loaded fries and American street food',
        rating: 4.2, deliveryTime: '20-30 min', minOrder: 100,
        color: '#F4A261', tag: 'Fast Delivery',
        menu: [
          {
            name: 'Classic Smash Burger', emoji: '🍔', price: 199,
            category: 'Burgers', isVeg: false,
            description: 'Smashed beef patty, American cheese, pickles, special sauce',
            customization: {
              bunOptions:      ['Sesame Bun', 'Brioche Bun (+₹20)', 'Whole Wheat Bun', 'Gluten-Free Bun (+₹30)', 'Lettuce Wrap (No Bun)'],
              pattyOptions:    ['Single Patty', 'Double Patty (+₹70)', 'Triple Patty (+₹130)'],
              donenessOptions: ['Medium Rare', 'Medium', 'Well Done'],
              addOnOptions: [
                { name: 'Extra Cheese Slice',  price: 30 },
                { name: 'Avocado',             price: 50 },
                { name: 'Crispy Bacon',        price: 60 },
                { name: 'Fried Egg',           price: 25 },
                { name: 'Jalapeños',           price: 15 },
                { name: 'Caramelised Onions',  price: 20 },
              ],
              removableItems: ['Onion', 'Pickles', 'Mustard', 'Ketchup', 'Lettuce', 'Tomato'],
            },
          },
          {
            name: 'Veggie Burger', emoji: '🥗', price: 169,
            category: 'Burgers', isVeg: true,
            description: 'Plant-based patty with fresh crunchy veggies',
            customization: {
              bunOptions:   ['Sesame Bun', 'Brioche Bun (+₹20)', 'Whole Wheat Bun', 'Gluten-Free Bun (+₹30)'],
              pattyOptions: ['Black Bean Patty', 'Mushroom Patty', 'Veggie Smash Patty', 'Double Patty (+₹60)'],
              addOnOptions: [
                { name: 'Vegan Cheese',         price: 35 },
                { name: 'Avocado',              price: 50 },
                { name: 'Caramelised Onions',   price: 20 },
                { name: 'Sriracha Drizzle',     price: 10 },
                { name: 'Truffle Mayo',         price: 25 },
              ],
              removableItems: ['Onion', 'Pickles', 'Mayo', 'Tomato', 'Lettuce'],
            },
          },
          {
            name: 'Chicken Crispy Burger', emoji: '🍗', price: 219,
            category: 'Burgers', isVeg: false,
            description: 'Crispy fried chicken fillet with coleslaw and pickles',
            customization: {
              spiceLevels:     ['Original', 'Spicy', 'Nashville Hot'],
              bunOptions:      ['Sesame Bun', 'Brioche Bun (+₹20)', 'Whole Wheat Bun'],
              addOnOptions: [
                { name: 'Extra Sauce',      price: 15 },
                { name: 'Extra Pickles',    price: 10 },
                { name: 'Bacon Strip',      price: 60 },
                { name: 'Cheese Slice',     price: 30 },
                { name: 'Avocado',          price: 50 },
              ],
              removableItems: ['Coleslaw', 'Pickles', 'Sauce', 'Onion'],
            },
          },
          {
            name: 'Loaded Crispy Fries', emoji: '🍟', price: 99,
            category: 'Sides', isVeg: true,
            description: 'Golden crispy fries with your choice of seasoning and dip',
            customization: {
              frySizeOptions:   ['Regular', 'Large (+₹40)', 'XL (+₹70)'],
              seasoningOptions: ['Classic Salt', 'Peri-Peri', 'Cheese Powder (+₹20)', 'Truffle & Parmesan (+₹40)', 'BBQ Rub', 'Masala'],
              addOnOptions: [
                { name: 'Cheese Dip',        price: 25 },
                { name: 'Chipotle Mayo',     price: 15 },
                { name: 'Loaded Cheese Pour',price: 40 },
                { name: 'Bacon Crumble',     price: 50 },
                { name: 'Jalapeños',         price: 15 },
              ],
              removableItems: ['Salt', 'Seasoning'],
            },
          },
          {
            name: 'Chocolate Shake', emoji: '🥤', price: 149,
            category: 'Drinks', isVeg: true,
            description: 'Thick, creamy hand-spun chocolate milkshake',
            customization: {
              sizeOptionsD:       ['Regular (400ml)', 'Large (600ml) (+₹50)'],
              sweetnessOptions:   ['Less Sweet', 'Normal', 'Extra Sweet'],
              addOnOptions: [
                { name: 'Extra Whipped Cream', price: 20 },
                { name: 'Oreo Crumble',        price: 25 },
                { name: 'Chocolate Drizzle',   price: 15 },
              ],
              removableItems: ['Whipped Cream', 'Chocolate Sauce'],
            },
          },
        ],
      },

      // ─────────────────────────────────────────────
      // PIZZA PARADISE — Italian
      // ─────────────────────────────────────────────
      {
        name: 'Pizza Paradise', cuisine: 'Italian', emoji: '🍕',
        description: 'Wood-fired artisan pizzas and Italian classics',
        rating: 4.3, deliveryTime: '25-35 min', minOrder: 200,
        color: '#E63946', tag: 'Popular',
        menu: [
          {
            name: 'Margherita Pizza', emoji: '🍕', price: 299,
            category: 'Pizza', isVeg: true,
            description: 'Classic tomato sauce, fresh mozzarella and fragrant basil',
            customization: {
              crustOptions:  ['Thin Crust', 'Classic Hand-Tossed', 'Thick Pan (+₹30)', 'Stuffed Crust (+₹60)', 'Gluten-Free Base (+₹50)'],
              sizeOptions:   ['7" Personal', '10" Regular', '13" Large (+₹80)', '16" Party (+₹200)'],
              sauceOptions:  ['Classic Tomato', 'Spicy Arrabiata', 'White Garlic Cream', 'Pesto Base'],
              addOnOptions: [
                { name: 'Extra Mozzarella',   price: 40 },
                { name: 'Cherry Tomatoes',    price: 25 },
                { name: 'Truffle Oil Drizzle',price: 60 },
                { name: 'Pesto Drizzle',      price: 30 },
                { name: 'Buffalo Mozzarella (+premium)', price: 80 },
              ],
              removableItems: ['Basil', 'Olive Oil', 'Garlic'],
            },
          },
          {
            name: 'Pepperoni Pizza', emoji: '🍕', price: 399,
            category: 'Pizza', isVeg: false,
            description: 'Generously loaded with spicy pepperoni and melted cheese',
            customization: {
              crustOptions: ['Thin Crust', 'Classic Hand-Tossed', 'Thick Pan (+₹30)', 'Stuffed Crust (+₹60)'],
              sizeOptions:  ['7" Personal', '10" Regular', '13" Large (+₹80)'],
              sauceOptions: ['Classic Tomato', 'Spicy Arrabiata', 'BBQ Base'],
              addOnOptions: [
                { name: 'Extra Pepperoni',  price: 60 },
                { name: 'Extra Cheese',     price: 40 },
                { name: 'Jalapeños',        price: 20 },
                { name: 'Mushrooms',        price: 25 },
                { name: 'Black Olives',     price: 20 },
              ],
              removableItems: ['Onion', 'Oregano', 'Chilli Flakes', 'Garlic'],
            },
          },
          {
            name: 'BBQ Chicken Pizza', emoji: '🍗', price: 449,
            category: 'Pizza', isVeg: false,
            description: 'Smoky BBQ base, grilled chicken, red onion, cheddar',
            customization: {
              crustOptions: ['Thin Crust', 'Classic Hand-Tossed', 'Thick Pan (+₹30)', 'Stuffed Crust (+₹60)'],
              sizeOptions:  ['7" Personal', '10" Regular', '13" Large (+₹80)'],
              spiceLevels:  ['Mild', 'Medium', 'Spicy'],
              addOnOptions: [
                { name: 'Extra Chicken',      price: 70 },
                { name: 'Extra Cheese',       price: 40 },
                { name: 'Jalapeños',          price: 20 },
                { name: 'Smoked Paprika',     price: 15 },
                { name: 'Caramelised Onions', price: 20 },
              ],
              removableItems: ['Red Onion', 'Coriander', 'BBQ Sauce'],
            },
          },
          {
            name: 'Penne Arrabiata', emoji: '🍝', price: 249,
            category: 'Pasta', isVeg: true,
            description: 'Penne in fiery garlic-chilli tomato sauce',
            customization: {
              pastaTypeOptions: ['Penne', 'Spaghetti', 'Fusilli', 'Rigatoni', 'Gluten-Free Penne (+₹30)'],
              spiceLevels:      ['Mild', 'Medium', 'Spicy', 'Extra Spicy'],
              addOnOptions: [
                { name: 'Grilled Chicken',  price: 70  },
                { name: 'Shrimp',           price: 100 },
                { name: 'Extra Parmesan',   price: 25  },
                { name: 'Garlic Bread Side',price: 60  },
                { name: 'Truffle Oil',      price: 50  },
              ],
              removableItems: ['Garlic', 'Capers', 'Parsley', 'Chilli Flakes'],
            },
          },
          {
            name: 'Tiramisu', emoji: '🍮', price: 180,
            category: 'Desserts', isVeg: true,
            description: 'Classic Italian dessert with espresso-soaked ladyfingers',
            customization: {
              portionOptions:   ['Regular', 'Large (+₹60)'],
              addOnOptions: [
                { name: 'Extra Mascarpone', price: 30 },
                { name: 'Chocolate Shavings', price: 20 },
                { name: 'Berries',          price: 35 },
              ],
              removableItems: ['Coffee', 'Cocoa Powder'],
            },
          },
        ],
      },

      // ─────────────────────────────────────────────
      // SUSHI WORLD — Japanese
      // ─────────────────────────────────────────────
      {
        name: 'Sushi World', cuisine: 'Japanese', emoji: '🍣',
        description: 'Fresh sushi crafted daily with premium-grade fish',
        rating: 4.6, deliveryTime: '40-50 min', minOrder: 300,
        color: '#2A9D8F', tag: 'Premium',
        menu: [
          {
            name: 'Salmon Nigiri (2 pcs)', emoji: '🍣', price: 320,
            category: 'Nigiri', isVeg: false,
            description: 'Hand-pressed sushi rice topped with fresh Atlantic salmon',
            customization: {
              addOnOptions: [
                { name: 'Truffle Soy Glaze',  price: 40 },
                { name: 'Torched (+flame)',   price: 30 },
                { name: 'Tobiko (Fish Roe)',  price: 50 },
                { name: 'Avocado Slice',      price: 30 },
              ],
              countOptions:   ['2 pieces', '4 pieces (+₹310)', '6 pieces (+₹610)'],
              removableItems: ['Wasabi', 'Gari (Pickled Ginger)', 'Nori Band'],
            },
          },
          {
            name: 'California Roll (8 pcs)', emoji: '🌀', price: 280,
            category: 'Rolls', isVeg: false,
            description: 'Crab, avocado and cucumber rolled in seasoned sushi rice',
            customization: {
              addOnOptions: [
                { name: 'Spicy Mayo Drizzle', price: 20 },
                { name: 'Tempura Crunch',     price: 30 },
                { name: 'Extra Avocado',      price: 40 },
                { name: 'Tobiko on Top',      price: 50 },
                { name: 'Unagi Sauce',        price: 25 },
              ],
              removableItems: ['Sesame Seeds', 'Cucumber', 'Gari'],
            },
          },
          {
            name: 'Spicy Tuna Roll (8 pcs)', emoji: '🍱', price: 360,
            category: 'Rolls', isVeg: false,
            description: 'Diced tuna with spicy sriracha mayo wrapped in nori',
            customization: {
              spiceLevels:  ['Mild', 'Medium Spicy', 'Very Spicy'],
              addOnOptions: [
                { name: 'Avocado Layer',      price: 40 },
                { name: 'Tempura Crunch',     price: 30 },
                { name: 'Sesame Topping',     price: 10 },
                { name: 'Jalapeño Slices',    price: 20 },
              ],
              removableItems: ['Cucumber', 'Spring Onion', 'Sesame'],
            },
          },
          {
            name: 'Miso Soup', emoji: '🍜', price: 120,
            category: 'Soups', isVeg: true,
            description: 'Traditional Japanese fermented soybean broth',
            customization: {
              addOnOptions: [
                { name: 'Extra Tofu',       price: 20 },
                { name: 'Wakame Seaweed',   price: 15 },
                { name: 'Spring Onion',     price: 10 },
                { name: 'Mushrooms',        price: 25 },
              ],
              removableItems: ['Tofu', 'Wakame', 'Spring Onion'],
            },
          },
          {
            name: 'Matcha Ice Cream', emoji: '🍦', price: 160,
            category: 'Desserts', isVeg: true,
            description: 'Premium Japanese green tea ice cream',
            customization: {
              portionOptions: ['Single Scoop', 'Double Scoop (+₹80)', 'Triple Scoop (+₹150)'],
              addOnOptions: [
                { name: 'Red Bean Paste',   price: 25 },
                { name: 'Mochi Bites',      price: 35 },
                { name: 'Waffle Cone (+)',  price: 20 },
                { name: 'Azuki Drizzle',    price: 20 },
              ],
              removableItems: ['Wafer'],
            },
          },
        ],
      },
    ];

    const created = await Restaurant.insertMany(restaurants);
    res.status(201).json({ message: `${created.length} restaurants seeded successfully`, restaurants: created.map(r => ({ id: r._id, name: r.name })) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
