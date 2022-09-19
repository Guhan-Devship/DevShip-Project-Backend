var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var IMAGE_SCHEMA = {};
IMAGE_SCHEMA.IMAGE = {
  image: [{ type: String }],
};

module.exports = IMAGE_SCHEMA;
