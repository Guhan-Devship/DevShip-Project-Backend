var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PRACTICE_SCHEMA = {};
PRACTICE_SCHEMA.PRACTICE = {
  first_name: { type: String },
  last_name: { type: String },
  year_born: { type: String },
  year_died: { type: String },
  nationality: { type: String },
};

module.exports = PRACTICE_SCHEMA;
