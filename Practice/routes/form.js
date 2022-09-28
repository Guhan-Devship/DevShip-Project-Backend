const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
var middlewares = require('../../model/middlewares.js');
const { ensureAuthorizedClient } = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var form = require('../../Practice/controller/form')(app, io);
    app.post('/createform', form.createForm);
    app.get('/getallform', form.getList);
    app.delete('/deleteform/:id', form.deleteForm);
    app.get('/getforms/:id', form.getformById);
    app.post('/moveform/:id', form.moveformById);
    app.put('/updateform/:id', form.updateForm);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
