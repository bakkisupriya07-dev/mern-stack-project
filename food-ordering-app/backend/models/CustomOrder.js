const mongoose = require('mongoose');

const customizedItemSchema = new mongoose.Schema({
  menuItemId:   { type: String, required: true },
  menuItemName: { type: String, required: true },
  emoji:        { type: String, default: '' },
  basePrice:    { type: Number, required: true },
  finalPrice:   { type: Number, required: true },
  quantity:     { type: Number, default: 1, min: 1 },

  spiceLevel:          { type: String, default: '' },
  gravyChoice:         { type: String, default: '' },
  portionChoice:       { type: String, default: '' },
  marinationChoice:    { type: String, default: '' },
  cookStyleChoice:     { type: String, default: '' },
  proteinChoice:       { type: String, default: '' },
  breadTypeChoice:     { type: String, default: '' },
  countChoice:         { type: String, default: '' },
  bunChoice:           { type: String, default: '' },
  pattyChoice:         { type: String, default: '' },
  donenessChoice:      { type: String, default: '' },
  crustChoice:         { type: String, default: '' },
  sizeChoice:          { type: String, default: '' },
  sauceChoice:         { type: String, default: '' },
  frySizeChoice:       { type: String, default: '' },
  seasoningChoice:     { type: String, default: '' },
  temperatureChoice:   { type: String, default: '' },
  sweetnessChoice:     { type: String, default: '' },
  pastaTypeChoice:     { type: String, default: '' },

  selectedAddOns:      [{ name: String, price: Number }],
  removedIngredients:  [{ type: String }],
  specialInstructions: { type: String, default: '' },
}, { _id: false });

const customOrderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId:    { type: String, required: true },
  restaurantName:  { type: String, required: true },
  items:           [customizedItemSchema],
  totalAmount:     { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  paymentMethod:   { type: String, enum: ['Cash on Delivery', 'Online Payment'], default: 'Cash on Delivery' },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('CustomOrder', customOrderSchema);
