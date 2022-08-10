var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SHIPPING_ADDRESS_SCHEMA = {};
SHIPPING_ADDRESS_SCHEMA.SHIPPING = {
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  shippingAddress: { type: Boolean, default: false },
};

module.exports = SHIPPING_ADDRESS_SCHEMA;
