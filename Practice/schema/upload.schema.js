var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UPLOAD_SCHEMA = {};
UPLOAD_SCHEMA.UPLOAD = {
  files: [{ type: String }],
  folderId: { type: mongoose.Schema.Types.ObjectId },
};

module.exports = UPLOAD_SCHEMA;
