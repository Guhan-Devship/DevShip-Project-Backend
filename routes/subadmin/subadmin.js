const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
const subadmin = require('../../controller/subadmin/subadmin');
var library = require('../../model/library.js');
const middlewares = require('../../model/middlewares.js');
const {
  ensureAuthorizedClient,
  ensureAuthorizedAdmin,
} = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var subadmin = require('../../controller/subadmin/subadmin')(app, io);

    app.post('/new/subadmin', ensureAuthorizedAdmin, subadmin.createSubadmin);
    app.get('/getsubadmin/:id', ensureAuthorizedAdmin, subadmin.getsubadminById);
    app.get('/getallSuadmins', ensureAuthorizedAdmin, subadmin.getSubamins);
    app.put('/updatesubadmin/:id', ensureAuthorizedAdmin, subadmin.updateSubAdmin);
    app.delete('/deleteSubadmin/:id', ensureAuthorizedAdmin, subadmin.deleteSubadmin);
    app.post(
      '/request-subadmin-login/:subadminId',
      [check('_id', library.capitalize('ID is required')).not().isEmpty()],
      subadmin.requestloginSubadmin
    );
    app.post('/login/subadmin/:uuid', subadmin.loginAsSubadmin);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
