var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var config_admin_schema = require('../schema/admins.schema.js');
var config_subadmin_schema = require('../schema/subadmin.schema.js');
var config_user_schema = require('../schema/client.schema.js');
var config_category_schema = require('../schema/category.schema.js');
var config_product_schema = require('../schema/product.schema.js');
var config_cart_schema = require('../schema/cart.schema.js');
var config_billing_schema = require('../schema/billing.schema.js');
var config_shipping_schema = require('../schema/shipping.schema.js');
var config_order_schema = require('../schema/order.schema');
var config_contact_schema = require('../schema/contact.schema');
var config_address_schema = require('../schema/address.schema');
var config_practice_schema = require('../schema/practice.schema');
var config_salary_schema = require('../Practice/schema/salary.schema');
var config_mark_schema = require('../Practice/schema/mark.schema');
var config_image_schema = require('../Practice/schema/image.schema');
var config_form_schema = require('../Practice/schema/form.schema');
var config_role_schema = require('../schema/role.schema');
var config_skill_schema = require('../schema/skill.schema');
var config_pricing_schema = require('../schema/pricing.schema');
var config_upload_schema = require('../Practice/schema/upload.schema');
var config_folder_schema = require('../Practice/schema/folder.schema');

var adminSchema = mongoose.Schema(config_admin_schema.ADMIN, {
  timestamps: true,
  versionKey: false,
});
var subadminSchema = mongoose.Schema(config_subadmin_schema.SUBADMIN, {
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
var practiceSchema = mongoose.Schema(config_practice_schema.PRACTICE, {
  timestamps: true,
  versionKey: false,
});
var salarySchema = mongoose.Schema(config_salary_schema.SALARY, {
  timestamps: true,
  versionKey: false,
});
var markSchema = mongoose.Schema(config_mark_schema.MARK, {
  timestamps: true,
  versionKey: false,
});
var imageSchema = mongoose.Schema(config_image_schema.IMAGE, {
  timestamps: true,
  versionKey: false,
});
var formSchema = mongoose.Schema(config_form_schema.FORM, {
  timestamps: true,
  versionKey: false,
});
var roleSchema = mongoose.Schema(config_role_schema.ROLE, {
  timestamps: true,
  versionKey: false,
});
var skillSchema = mongoose.Schema(config_skill_schema.SKILL, {
  timestamps: true,
  versionKey: false,
});

var pricingSchema = mongoose.Schema(config_pricing_schema.PRICING, {
  timestamps: true,
  versionKey: false,
});

var uploadSchema = mongoose.Schema(config_upload_schema.UPLOAD, {
  timestamps: true,
  versionKey: false,
});
var folderSchema = mongoose.Schema(config_folder_schema.FOLDER, {
  timestamps: true,
  versionKey: false,
});

adminSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

adminSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

subadminSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
subadminSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

var admins = mongoose.model('admins', adminSchema, 'admins');
var subadmins = mongoose.model('subadmins', subadminSchema, 'subadmins');
var client = mongoose.model('client', userSchema, 'client');
var category = mongoose.model('category', categorySchema, 'category');
var product = mongoose.model('product', productSchema, 'product');
var cart = mongoose.model('cart', cartSchema, 'cart');
var billingaddress = mongoose.model('billingaddress', billingSchema, 'billingaddress');
var shippingaddress = mongoose.model('shippingaddress', shippingSchema, 'shippingaddress');
var order = mongoose.model('order', orderSchema, 'order');
var contact = mongoose.model('contact', contactSchema, 'contact');
var address = mongoose.model('address', addressSchema, 'address');
var practice = mongoose.model('practice', practiceSchema, 'practice');
var salary = mongoose.model('salary', salarySchema, 'salary');
var mark = mongoose.model('mark', markSchema, 'mark');
var multiImage = mongoose.model('multiImage', imageSchema, 'multiImage');
var form = mongoose.model('form', formSchema, 'form');
var role = mongoose.model('role', roleSchema, 'role');
var skill = mongoose.model('skill', skillSchema, 'skill');
var pricing = mongoose.model('pricing', pricingSchema, 'pricing');
var uploads = mongoose.model('uploads', uploadSchema, 'uploads');
var folder = mongoose.model('folder', folderSchema, 'folder');

module.exports = {
  admins: admins,
  subadmins: subadmins,
  client: client,
  category: category,
  product: product,
  cart: cart,
  billingaddress: billingaddress,
  shippingaddress: shippingaddress,
  order: order,
  contact: contact,
  address: address,
  practice: practice,
  salary: salary,
  mark: mark,
  multiImage: multiImage,
  form: form,
  role: role,
  skill: skill,
  pricing: pricing,
  uploads: uploads,
  folder: folder,
};
