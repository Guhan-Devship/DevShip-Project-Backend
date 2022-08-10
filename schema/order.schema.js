var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ORDER_SCHEMA = {};
ORDER_SCHEMA.ORDER = {
  client: { type: String },
  title: { type: String },
  image: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  offerPrice: { type: Number },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
};

module.exports = ORDER_SCHEMA;
