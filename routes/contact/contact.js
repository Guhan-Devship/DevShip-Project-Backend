const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
const middlewares = require('../../model/middlewares.js');
const {
  ensureAuthorizedClient,
  ensureAuthorizedAdmin,
} = require('../../model/security/ensureAuthorised.js');

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
    app.get('/allContact', ensureAuthorizedAdmin, contact.getContact);
    app.get('/getContact/:id', ensureAuthorizedAdmin, contact.getContactById);
    app.delete('/deleteContact/:id', ensureAuthorizedAdmin, contact.deleteContact);
    app.delete(
      '/deleteContactAddress/:id/:userId',
      ensureAuthorizedAdmin,
      contact.deleteContactAddress
    );
    app.put('/updateContact/:id', ensureAuthorizedAdmin, contact.updateContact);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
