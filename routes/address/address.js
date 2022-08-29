const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
const middlewares = require('../../model/middlewares.js');
const { ensureAuthorizedClient } = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var address = require('../../controller/address/address/address')(app, io);

    app.post('/address/:id', ensureAuthorizedClient, address.userAddress);
    app.get('/AddressGet/:id', address.getAddress);
    app.delete('/deleteaddress/:id', ensureAuthorizedClient, address.deleteAddress);
    app.put('/AddressUpdate/:id', address.updateAddress);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
