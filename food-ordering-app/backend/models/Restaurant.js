const mongoose = require('mongoose');

// Each add-on option (e.g. "Extra Cheese +₹30")
const addonOptionSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  price: { type: Number, default: 0 },
}, { _id: false });

// Per-item customization config — only the fields relevant to that item are populated
const itemCustomizationConfigSchema = new mongoose.Schema({
  // Spice (Curries, Pasta, etc.)
  spiceLevels:    [String],

  // Curries
  gravyOptions:   [String],
  portionOptions: [String],

  // Paneer Tikka / grilled
  marinationOptions: [String],
  cookStyleOptions:  [String],

  // Biryani
  proteinOptions: [String],

  // Bread items (Naan, Roti)
  breadTypeOptions: [String],
  countOptions:     [String],

  // Burger
  bunOptions:      [String],
  pattyOptions:    [String],
  donenessOptions: [String],

  // Pizza
  crustOptions:   [String],
  sizeOptions:    [String],
  sauceOptions:   [String],

  // Fries / Sides
  frySizeOptions:   [String],
  seasoningOptions: [String],

  // Drinks
  temperatureOptions: [String],
  sweetnessOptions:   [String],
  sizeOptionsD:       [String],

  // Pasta
  pastaTypeOptions: [String],

  // Universal
  addOnOptions:     [addonOptionSchema],   // paid add-ons
  removableItems:   [String],              // ingredients user can remove
}, { _id: false });

const menuItemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true },
  category:    { type: String, required: true },
  emoji:       { type: String, default: '🍽️' },
  isVeg:       { type: Boolean, default: false },
  customization: itemCustomizationConfigSchema,
}, { _id: true });

const restaurantSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  cuisine:      { type: String, required: true },
  description:  { type: String, default: '' },
  emoji:        { type: String, default: '🍽️' },
  rating:       { type: Number, default: 4.0 },
  deliveryTime: { type: String, default: '30-40 min' },
  minOrder:     { type: Number, default: 100 },
  color:        { type: String, default: '#FF4500' },
  tag:          { type: String, default: '' },
  menu:         [menuItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
