var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SKILL_SCHEMA = {};
SKILL_SCHEMA.SKILL = {
  skill_name: { type: String, required: true },
};

module.exports = SKILL_SCHEMA;
