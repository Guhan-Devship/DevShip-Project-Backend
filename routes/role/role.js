const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
const middlewares = require('../../model/middlewares.js');
const { ensureAuthorizedClient } = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var role = require('../../controller/role/role')(app, io);

    app.post('/newRole', role.createRole);

    app.get('/getRole', role.getRole);
    app.get('/getRoleby/:id', role.getroleById);
    app.put('/updateRole/:id', role.updateRole);

    app.delete('/deleteRole/:id', role.deleteRole);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
