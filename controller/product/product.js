const db = require('../../controller/db_adaptor/mongodb.js');
const { validationResult } = require('express-validator');
const fs = require('fs');
const multer = require('multer');
var _ = require('lodash');
const {
  InsertDocument,
  GetDocument,
  DeleteOneDocument,
  UpdateOneDocument,
  UpdateManyDocument,
  GetOneDocument,
} = require('../db_adaptor/mongodb');
const path = require('path');
const library = require('../../model/library.js');
const { PRODUCT } = require('../../schema/product.schema.js');

module.exports = (app, io) => {
  var router = {};

  router.createProduct = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const image = library.get_attachment(
      req.files.image[0].destination,
      req.files.image[0].filename
    );
    const title = _.get(req.body, 'title', '');
    const desc = _.get(req.body, 'desc', '');
    const model = _.get(req.body, 'model', '');
    const category = _.get(req.body, 'category', '');
    const price = _.get(req.body, 'price', 0);
    const offerPrice = _.get(req.body, 'offerPrice', 0);

    const product = {
      title,
      image,
      desc,
      model,
      category,
      price,
      offerPrice,
    };

    let insert = await InsertDocument('product', product);
    if (insert && insert._id) {
      res.json({ status: 1, message: 'Product Created' });
    } else {
      res.json({ status: 0, message: 'Failed to create Product' });
    }
  };

  router.getProduct = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let allProduct = await GetDocument('product', {}, {}, {});
      if (allProduct) {
        res.send(allProduct);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.getProductbyId = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let productbyId = await GetOneDocument('product', { _id: req.params.id }, {}, {});
      if (productbyId) {
        res.send(productbyId);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteProduct = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let remove = await DeleteOneDocument('product', { _id: req.params.id });
      if (remove) {
        res.json({ message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.updateProduct = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let update = await UpdateOneDocument('product', { _id: req.params.id }, { $set: req.body });
      if (update) {
        res.json({ message: 'Updated' });
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.countByCategory = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let eachProduct = await GetDocument('product', { category: req.params.id }, {}, {});
      if (eachProduct) {
        res.send(eachProduct);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return router;
};
