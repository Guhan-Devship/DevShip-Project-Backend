var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CART_SCHEMA = {};
CART_SCHEMA.CART = {
  client: { type: String },
  title: { type: String },
  image: { type: String },
  price: { type: Number },
  offerPrice: { type: Number },
  quantity: { type: Number, default: 1 },
  createdby: { type: mongoose.Schema.Types.ObjectId },
};

module.exports = CART_SCHEMA;
