var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MARK_SCHEMA = {};
MARK_SCHEMA.MARK = {
  student: { type: String },
  homework: [{ type: Number }],
  quiz: [{ type: Number }],
  extraCredit: { type: Number },
};

module.exports = MARK_SCHEMA;
