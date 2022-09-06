const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
var middlewares = require('../../model/middlewares.js');
const { ensureAuthorizedClient } = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var order = require('../../Practice/controller/product')(app, io);
    app.post('/createList', order.createlist);
    app.get('/addField', order.getOrder_addFields);
    app.get('/bucket', order.getOrder_bucket);
    app.get('/group', order.getOrder_group);
    app.get('/merge', order.getOrder_merge);
    app.get('/project', order.getOrder_project);
    app.get('/filter', order.getOrder_filter);
    app.get('/set', order.getOrder_mark);
    app.get('/lookup', order.getOrder_lookup);
    app.get('/cond', order.getOrder_cond);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
