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
    var order = require('../../controller/order/order')(app, io);
    app.post('/new/order', ensureAuthorizedAdmin, order.createOrder);
    app.get('/all/order', ensureAuthorizedAdmin, order.getOrder);
    // app.get('/product/:id', ensureAuthorizedClient, products.getProductbyId);
    app.delete('/deleteOrder/:id', ensureAuthorizedAdmin, order.deleteOrder);
    // app.put(
    //   '/updateProduct/:id',
    //   //   middlewares
    //   //     .commonUpload(CONFIG.DIRECTORY_USER_PHOTO)
    //   //     .fields([{ name: 'image', maxCount: 1 }]),
    //   products.updateProduct
    // );
    // app.get('/category/:id', products.countByCategory);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
