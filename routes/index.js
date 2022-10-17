'use strict';

var express = require('express');
var path = require('path');
var jwt = require('jsonwebtoken');

var CONFIG = require('../config/config.js');

var dynamicTime = '';
var fs = require('fs');

module.exports = function (app, io) {
  try {
    var admin = require('../routes/admin')(app, io);
    var subadmin = require('../routes/subadmin/subadmin')(app, io);
    var client = require('../routes/client')(app, io);
    var category = require('../routes/category/category')(app, io);
    var product = require('../routes/product/product')(app, io);
    var cart = require('../routes/cart/cart.js')(app, io);
    var billingAdrress = require('../routes/address/billingAddress')(app, io);
    var shippingAdrress = require('../routes/address/shippingAddress')(app, io);
    var order = require('../routes/order/order')(app, io);
    var contact = require('../routes/contact/contact')(app, io);
    var address = require('../routes/address/address')(app, io);
    var practice = require('../Practice/routes/product')(app, io);
    var upload = require('../Practice/routes/multiImage')(app, io);
    var form = require('../Practice/routes/form')(app, io);
    var role = require('../routes/role/role')(app, io);
    var skill = require('../routes/skill/skill')(app, io);
    var pricing = require('../routes/pricing/pricing')(app, io);
    var uploads = require('../Practice/routes/upload')(app, io);
    var folder = require('../Practice/routes/folder')(app, io);

    app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.get('/admin/shop/*', function (req, res) {
      res.sendFile(path.join(__dirname, '../public/admin/shop/index.html'));
    });

    app.get('/admin/*', function (req, res) {
      res.sendFile(path.join(__dirname, '../public/admin/index.html'));
    });

    app.get('/*', function (req, res) {
      res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
  } catch (e) {
    console.log('error in index.js---------->>>>', e);
  }
};
