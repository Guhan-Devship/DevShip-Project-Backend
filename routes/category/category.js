const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
const middlewares = require('../../model/middlewares.js');
const { ensureAuthorizedClient } = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var category = require('../../controller/category/category.js')(app, io);

    app.post(
      '/newCategory',
      middlewares
        .commonUpload(CONFIG.DIRECTORY_CLIENT_CATEGORIES_PHOTO)
        .fields([{ name: 'image', maxCount: 1 }]),
      ensureAuthorizedClient,
      category.createCategory
    );

    app.get('/getCategory', category.getCategory);

    app.delete('/deleteCategory/:id', ensureAuthorizedClient, category.deleteCategory);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
