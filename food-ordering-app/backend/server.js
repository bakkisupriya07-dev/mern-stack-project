const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Routes
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/restaurants',   require('./routes/restaurantRoutes'));
app.use('/api/cart',          require('./routes/cartRoutes'));
app.use('/api/orders',        require('./routes/orderRoutes'));
app.use('/api/custom-orders', require('./routes/customOrderRoutes'));

app.get('/', (req, res) => res.json({ message: 'FoodExpress API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
