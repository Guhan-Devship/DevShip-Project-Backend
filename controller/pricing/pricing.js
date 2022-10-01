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
  GetCount,
  GetAggregation,
} = require('../db_adaptor/mongodb');
const path = require('path');
const library = require('../../model/library.js');
const { PRODUCT } = require('../../schema/product.schema.js');

module.exports = (app, io) => {
  var router = {};
  router.createPricing = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const pricing_name = _.get(req.body, 'pricing_name', '');
    const price = _.get(req.body, 'price', 0);

    const pricing = {
      pricing_name,
      price,
    };

    let insert = await InsertDocument('pricing', pricing);
    if (insert && insert._id) {
      res.json({ status: 1, message: 'pricing Created' });
    } else {
      res.json({ status: 0, message: 'Failed to create pricing' });
    }
  };
  router.getPricing = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let allprice = await GetDocument('pricing', {}, {}, {});
      if (allprice) {
        res.send(allprice);
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.getPricingbyId = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let price = await GetOneDocument('pricing', { _id: req.params.id }, {}, {});
      if (price) {
        res.send(price);
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.updatePricing = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      const pricing_name = _.get(req.body, 'pricing_name', '');
      const price = _.get(req.body, 'price', 0);

      const pricing = {
        pricing_name,
        price,
      };

      let update = await UpdateOneDocument('pricing', { _id: req.params.id }, pricing);
      if (update) {
        res.json({ message: 'Updated' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.deletePricing = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let remove = await DeleteOneDocument('pricing', { _id: req.params.id });
      if (remove) {
        res.json({ message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  return router;
};
