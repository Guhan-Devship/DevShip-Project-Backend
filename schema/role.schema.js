var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ROLE_SCHEMA = {};
ROLE_SCHEMA.ROLE = {
  role_name: { type: String, required: true },
};

module.exports = ROLE_SCHEMA;
