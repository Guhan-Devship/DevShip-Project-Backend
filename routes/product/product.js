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
    var products = require('../../controller/product/product.js')(app, io);
    app.post(
      '/new/product',
      middlewares
        .commonUpload(CONFIG.DIRECTORY_USER_PHOTO)
        .fields([{ name: 'image', maxCount: 1 }]),
      ensureAuthorizedAdmin,
      products.createProduct
    );
    app.get('/all/product', products.getProduct);
    app.get('/product/:id', ensureAuthorizedAdmin, products.getProductbyId);
    app.delete('/deleteProduct/:id', ensureAuthorizedAdmin, products.deleteProduct);
    app.put(
      '/updateProduct/:id',
      //   middlewares
      //     .commonUpload(CONFIG.DIRECTORY_USER_PHOTO)
      //     .fields([{ name: 'image', maxCount: 1 }])
      ensureAuthorizedAdmin,
      products.updateProduct
    );
    app.get('/category/:id', ensureAuthorizedAdmin, products.countByCategory);
    app.get('/product', products.productAggregation);
    app.post('/products', products.AggregationProduct);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
