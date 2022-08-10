var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CATEGORY_SCHEMA = {};
CATEGORY_SCHEMA.CATEGORY = {
  title: { type: String, required: true },
  image: { type: String },
};

module.exports = CATEGORY_SCHEMA;
