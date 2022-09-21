var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var IMAGE_SCHEMA = {};
IMAGE_SCHEMA.IMAGE = {
  image: [{ type: String }],
  createdby: { type: mongoose.Schema.Types.ObjectId },
};

module.exports = IMAGE_SCHEMA;
