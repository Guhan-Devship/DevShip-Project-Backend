const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
var middlewares = require('../../model/middlewares.js');
const {
  ensureAuthorizedClient,
  ensureAuthorizedAdmin,
} = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var form = require('../../Practice/controller/form')(app, io);
    app.post('/createform', ensureAuthorizedAdmin, form.createForm);
    app.get('/getallform', ensureAuthorizedAdmin, form.getList);
    app.delete('/deleteform/:id', ensureAuthorizedAdmin, form.deleteForm);
    app.get('/getforms/:id', ensureAuthorizedAdmin, form.getformById);
    app.post('/moveform/:id', ensureAuthorizedAdmin, form.moveformById);
    app.put('/updateform/:id', ensureAuthorizedAdmin, form.updateForm);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
