var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BILLING_ADDRESS_SCHEMA = {};
BILLING_ADDRESS_SCHEMA.BILLING = {
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  billingAddress: { type: Boolean, default: false },
};

module.exports = BILLING_ADDRESS_SCHEMA;
