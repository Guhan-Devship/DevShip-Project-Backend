var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PRICING_SCHEMA = {};
PRICING_SCHEMA.PRICING = {
  pricing_name: { type: String },
  price: { type: Number },
};

module.exports = PRICING_SCHEMA;
