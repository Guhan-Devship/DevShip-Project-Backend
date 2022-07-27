var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var config_admin_schema = require('../schema/admins.schema.js');
var config_user_schema = require('../schema/client.schema.js');

var adminSchema = mongoose.Schema(config_admin_schema.ADMIN, {
  timestamps: true,
  versionKey: false,
});
var userSchema = mongoose.Schema(config_user_schema.USER, {
  timestamps: true,
  versionKey: false,
});


adminSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

adminSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

var admins = mongoose.model('admins', adminSchema, 'admins');
var client = mongoose.model('client', userSchema, 'client');

module.exports = {
  admins: admins,
  client: client,
};
