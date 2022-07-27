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
    var client = require('../routes/client')(app, io);

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
