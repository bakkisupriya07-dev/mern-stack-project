const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId:   { type: String, required: true },
  name:         { type: String, required: true },
  emoji:        { type: String, default: '' },
  price:        { type: Number, required: true },
  quantity:     { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId:   { type: String, required: true },
  restaurantName: { type: String, required: true },
  items:          [orderItemSchema],
  totalAmount:    { type: Number, required: true },
  deliveryAddress:{ type: String, required: true },
  paymentMethod:  { type: String, enum: ['Cash on Delivery', 'Online Payment'], default: 'Cash on Delivery' },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
