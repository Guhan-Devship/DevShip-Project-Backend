const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
const middlewares = require('../../model/middlewares.js');
const { ensureAuthorizedClient } = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var cart = require('../../controller/cart/cart')(app, io);

    app.post('/newCart', cart.createCart);
    app.get('/allCart', ensureAuthorizedClient, cart.getCart);
    app.delete('/deleteCart/:id', ensureAuthorizedClient, cart.deleteCart);
    app.put('/updateCart/:id', cart.updateCart);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
