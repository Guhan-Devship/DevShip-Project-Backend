var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FOLDER_SCHEMA = {};
FOLDER_SCHEMA.FOLDER = {
  folder_name: { type: String, required: true },
  files: [{ type: String }],
};

module.exports = FOLDER_SCHEMA;
