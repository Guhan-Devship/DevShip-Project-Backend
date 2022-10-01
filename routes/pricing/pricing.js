const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
var middlewares = require('../../model/middlewares.js');
const { ensureAuthorizedClient } = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var pricing = require('../../controller/pricing/pricing')(app, io);
    app.post('/newPricing', pricing.createPricing);
    app.get('/getPricing', pricing.getPricing);
    app.get('/getPricingbyId/:id', pricing.getPricingbyId);
    app.put('/editPricing/:id', pricing.updatePricing);
    app.delete('/deletePricing/:id', pricing.deletePricing);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
