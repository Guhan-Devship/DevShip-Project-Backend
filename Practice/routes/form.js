const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
var middlewares = require('../../model/middlewares.js');
const { ensureAuthorizedClient } = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var form = require('../../Practice/controller/form')(app, io);
    app.post('/createform', ensureAuthorizedClient, form.createForm);
    app.get('/getallform', ensureAuthorizedClient, form.getList);
    app.delete('/deleteform/:id', ensureAuthorizedClient, form.deleteForm);
    app.get('/getforms/:id', ensureAuthorizedClient, form.getformById);
    app.post('/moveform/:id', ensureAuthorizedClient, form.moveformById);
    app.put('/updateform/:id', ensureAuthorizedClient, form.updateForm);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
