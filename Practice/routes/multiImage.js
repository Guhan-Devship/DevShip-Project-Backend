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
    var uploadFile = require('../../Practice/controller/multiImage')(app, io);
    app.post(
      '/upload',
      middlewares
        .commonUpload(CONFIG.DIRECTORY_CLIENT_CATEGORIES_PHOTO)
        .fields([{ name: 'image', maxCount: 5 }]),
      ensureAuthorizedAdmin,
      uploadFile.createMultiUpload
    );
    app.get('/getImages', uploadFile.getImages);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
