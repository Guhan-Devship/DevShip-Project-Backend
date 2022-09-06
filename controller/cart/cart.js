const db = require('../../controller/db_adaptor/mongodb.js');
const { validationResult } = require('express-validator');
const fs = require('fs');
const multer = require('multer');
var _ = require('lodash');
const {
  InsertDocument,
  GetDocument,
  DeleteOneDocument,
  InsertMultipleDocs,
  UpdateOneDocument,
} = require('../../controller/db_adaptor/mongodb.js');
const path = require('path');
const library = require('../../model/library.js');

module.exports = (app, io) => {
  var router = {};

  router.createCart = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const title = _.get(req.body, 'title', '');
    const image = _.get(req.body, 'image', '');
    const desc = _.get(req.body, 'desc', '');
    const model = _.get(req.body, 'model', '');
    const category = _.get(req.body, 'category', '');
    const price = _.get(req.body, 'price', 0);
    const offerPrice = _.get(req.body, 'offerPrice', 0);
    const quantity = _.get(req.body, 'quantity');
    const createdby = req.params.loginId;

    const cart = {
      title,
      image,
      desc,
      model,
      category,
      price,
      offerPrice,
      quantity,
      createdby,
    };
    console.log(createdby);

    let insert = await InsertDocument('cart', cart);
    if (insert) {
      res.json({ status: 1, message: 'cartList Created' });
    } else {
      res.json({ status: 0, message: 'Failed to create cart' });
    }
  };

  router.getCart = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let individualCart = await GetDocument('cart', { createdby: req.params.loginId }, {}, {});
      if (individualCart) {
        res.send(individualCart);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteCart = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let remove = await DeleteOneDocument('cart', { _id: req.params.id });
      if (remove) {
        res.json({ message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.updateCart = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let update = await UpdateOneDocument('cart', { _id: req.params.id }, { $set: req.body });
      if (update) {
        res.json({ message: 'Updated' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  return router;
};
