var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var config_admin_schema = require('../schema/admins.schema.js');
var config_user_schema = require('../schema/client.schema.js');
var config_category_schema = require('../schema/category.schema.js');
var config_product_schema = require('../schema/product.schema.js');
var config_cart_schema = require('../schema/cart.schema.js');
var config_billing_schema = require('../schema/billing.schema.js');
var config_shipping_schema = require('../schema/shipping.schema.js');
var config_order_schema = require('../schema/order.schema');
var config_contact_schema = require('../schema/contact.schema');
var config_address_schema = require('../schema/address.schema');

var adminSchema = mongoose.Schema(config_admin_schema.ADMIN, {
  timestamps: true,
  versionKey: false,
});
var userSchema = mongoose.Schema(config_user_schema.USER, {
  timestamps: true,
  versionKey: false,
});
var categorySchema = mongoose.Schema(config_category_schema.CATEGORY, {
  timestamps: true,
  versionKey: false,
});
var productSchema = mongoose.Schema(config_product_schema.PRODUCT, {
  timestamps: true,
  versionKey: false,
});

var cartSchema = mongoose.Schema(config_cart_schema.CART, {
  timestamps: true,
  versionKey: false,
});
var billingSchema = mongoose.Schema(config_billing_schema.BILLING, {
  timestamps: true,
  versionKey: false,
});
var shippingSchema = mongoose.Schema(config_shipping_schema.SHIPPING, {
  timestamps: true,
  versionKey: false,
});
var orderSchema = mongoose.Schema(config_order_schema.ORDER, {
  timestamps: true,
  versionKey: false,
});
var contactSchema = mongoose.Schema(config_contact_schema.CONTACT, {
  timestamps: true,
  versionKey: false,
});
var addressSchema = mongoose.Schema(config_address_schema.ADDRESS, {
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
var category = mongoose.model('category', categorySchema, 'category');
var product = mongoose.model('product', productSchema, 'product');
var cart = mongoose.model('cart', cartSchema, 'cart');
var billingaddress = mongoose.model('billingaddress', billingSchema, 'billingaddress');
var shippingaddress = mongoose.model('shippingaddress', shippingSchema, 'shippingaddress');
var order = mongoose.model('order', orderSchema, 'order');
var contact = mongoose.model('contact', contactSchema, 'contact');
var address = mongoose.model('address', addressSchema, 'address');

module.exports = {
  admins: admins,
  client: client,
  category: category,
  product: product,
  cart: cart,
  billingaddress: billingaddress,
  shippingaddress: shippingaddress,
  order: order,
  contact: contact,
  address: address,
};
