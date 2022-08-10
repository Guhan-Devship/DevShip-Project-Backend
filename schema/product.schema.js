var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PRODUCT_SCHEMA = {};
PRODUCT_SCHEMA.PRODUCT = {
  title: { type: String },
  desc: { type: String },
  image: { type: String },
  model: { type: String },
  category: { type: String },
  price: { type: Number },
  offerPrice: { type: Number },
  stockAvailability: { type: Boolean, default: true },
};

module.exports = PRODUCT_SCHEMA;
