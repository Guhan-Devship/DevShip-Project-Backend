var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FORM_SCHEMA = {};
FORM_SCHEMA.FORM = {
  first_name: { type: String },
  surname: { type: String },
  genderValue: [{ type: Object }],
  roleValue: [{ type: Object }],
  skill: [{ type: Object }],
  email: { type: String },
  password: { type: String },
  confirmPassword: { type: String },
  agree_terms: { type: Boolean },
  depositAmount: { type: Number },
  totalAmount: { type: Number },
  phone: {
    number: String,
    code: String,
    dialcountry: String,
  },
  movedToUser: { type: Boolean, default: false },
  createdby: { type: mongoose.Schema.Types.ObjectId },
};

module.exports = FORM_SCHEMA;
