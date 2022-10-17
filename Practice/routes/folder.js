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
    var folder = require('../../Practice/controller/folder')(app, io);
    app.post('/createFolder', folder.createFolder);
    app.get('/getFolder', folder.getfolder);
    app.get('/getFolderby/:id', folder.getFolderById);
    // app.put('/updateRole/:id', role.updateRole);
    app.post(
      '/folderUpload/:id',
      middlewares
        .commonUpload(CONFIG.DIRECTORY_ADMIN_UPLOAD_FILES)
        .fields([{ name: 'files', maxCount: 8 }]),
      folder.createFolderUploadFiles
    );
    app.delete('/deleteFolder/:id', folder.deleteFolder);
    app.post('/deleteFolderFile/:id', folder.deleteFolderUploadFile);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
