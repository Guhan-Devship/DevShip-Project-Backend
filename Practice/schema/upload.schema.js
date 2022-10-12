var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UPLOAD_SCHEMA = {};
UPLOAD_SCHEMA.UPLOAD = {
  files: [{ type: String }],
};

module.exports = UPLOAD_SCHEMA;
