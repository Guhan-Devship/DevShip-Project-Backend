const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
const middlewares = require('../../model/middlewares.js');
const { ensureAuthorizedClient } = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var contact = require('../../controller/contact/contact')(app, io);

    app.post(
      '/newContact',
      [
        check('name', library.capitalize('name is required')).not().isEmpty().trim(),
        check('email', library.capitalize('email is required')).isEmail(),
        check('message', library.capitalize('Message is required')).not().isEmpty().trim(),
      ],
      ensureAuthorizedClient,
      contact.createContacts
    );
    app.get('/allContact', contact.getContact);
    app.get('/getContact/:id', contact.getContactById);
    app.delete('/deleteContact/:id', contact.deleteContact);
    app.put('/updateContact/:id', contact.updateContact);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
