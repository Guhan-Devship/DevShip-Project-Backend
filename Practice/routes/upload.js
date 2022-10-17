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
    var uploadFile = require('../../Practice/controller/upload')(app, io);
    app.post(
      '/file/upload',
      middlewares
        .commonUpload(CONFIG.DIRECTORY_ADMIN_UPLOAD_FILES)
        .fields([{ name: 'files', maxCount: 8 }]),
      uploadFile.createUpload
    );

    app.get('/getfile', uploadFile.getUploadFiles);
    app.post('/deleteFiles/:id', uploadFile.deleteUploadFile);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
