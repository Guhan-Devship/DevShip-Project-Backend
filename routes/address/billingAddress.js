const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
const middlewares = require('../../model/middlewares.js');
const { ensureAuthorizedClient } = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var billingAddress = require('../../controller/address/billing_address/billingAddress.js')(
      app,
      io
    );

    app.post('/billingAddress/:id', ensureAuthorizedClient, billingAddress.UserBillingAddress);
    app.get('/billingaddress/:id', billingAddress.getBillingAddress);
    // app.get('/allCart', ensureAuthorizedClient, cart.getCart);
    app.delete('/deleteAddress/:id/:userId', billingAddress.deleteBillingAddress);
    app.put('/updateBillingAddress/:id', billingAddress.updateBillingAddress);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
