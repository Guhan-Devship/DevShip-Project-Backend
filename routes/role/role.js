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
    var role = require('../../controller/role/role')(app, io);

    app.post('/newRole', ensureAuthorizedAdmin, role.createRole);

    app.get('/getRole', ensureAuthorizedAdmin, role.getRole);
    app.get('/getRoleby/:id', ensureAuthorizedAdmin, role.getroleById);
    app.put('/updateRole/:id', ensureAuthorizedAdmin, role.updateRole);

    app.delete('/deleteRole/:id', ensureAuthorizedAdmin, role.deleteRole);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
