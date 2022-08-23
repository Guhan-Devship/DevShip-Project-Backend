var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ADDRESS_SCHEMA = {};
ADDRESS_SCHEMA.ADDRESS = {
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  address: { type: Boolean, default: false },
  createdby: { type: mongoose.Schema.Types.ObjectId },
};

module.exports = ADDRESS_SCHEMA;
