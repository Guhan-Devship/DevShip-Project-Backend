var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CONTACT_SCHEMA = {};
CONTACT_SCHEMA.CONTACT = {
  name: { type: String },
  organisation: { type: String },
  gender: { type: String },
  mobile: { type: Number },
  email: { type: String },
  message: { type: String },
  address: [
    {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      pincode: { type: String },
      address: { type: Boolean, default: false },
    },
  ],
  createdby: { type: mongoose.Schema.Types.ObjectId },
};

module.exports = CONTACT_SCHEMA;
