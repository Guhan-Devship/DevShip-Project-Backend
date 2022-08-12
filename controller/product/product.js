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

  router.productAggregation = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      const page = parseInt(req.query.page) - 1 || 0;
      const limit = _.get(req.query, 'limit', 0) || 4;
      const search = _.get(req.query, 'search', '') || '';
      let sort = {};
      let field = _.get(req.query, 'field', false);
      let category = _.get(req.query, 'category', '');
      let filterPrice = _.get(req.query, 'filterPrice', 0);

      //sorting from lower price to higher price
      if (field) {
        sort = { offerPrice: 1 };
      } else {
        sort = { offerPrice: -1 };
      }

      //empty query
      const query = [];
      //skip
      const skip = page * _.toNumber(limit);
      //sort
      if (sort !== '') {
        query.push({ $sort: sort });
      }
      //model wise filter
      if (category !== '') {
        query.push(
          { $match: { model: req.query.category } },
          { $skip: skip },
          { $limit: _.toNumber(limit) }
        );
      }
      //limits
      if (limit !== 4) {
        query.push({ $limit: _.toNumber(limit) }, { $skip: skip });
      }
      //search
      if (search !== '') {
        query.push(
          {
            $match: {
              $or: [
                {
                  model: {
                    $regex: search + '.*',
                    $options: 'si',
                  },
                },
              ],
            },
          },
          { $skip: skip },
          { $limit: _.toNumber(limit) }
        );
      }

      //price filter
      if (filterPrice !== 0) {
        const filter = { offerPrice: { $lte: _.toNumber(req.query.filterPrice) } };
        query.push({ $match: filter }, { $skip: skip }, { $limit: _.toNumber(limit) });
      }

      //Aggregation
      const product = await GetAggregation('product', query);

      //overall response
      const response = {
        error: false,
        total: product.length,
        page: _.toNumber(page) + 1,
        limit: _.toNumber(limit),
        product,
      };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
  };

  router.AggregationProduct = async (req, res) => {
    console.log(req.body);
    try {
      let skip = _.get(req.body, 'skip', 0),
        limit = _.get(req.body, 'limit', 25),
        sort = {};
      let search = _.get(req.body, 'search', '');
      let field = _.get(req.body, 'field', false);
      let product = _.get(req.body, 'product', '');
      let category = _.get(req.body, 'category', '');
      let filterPrice = _.get(req.body, 'filterPrice', 0);

      if (field) {
        sort = { offerPrice: 1 };
      } else {
        sort = { offerPrice: -1 };
      }

      let query = [];
      if (search) {
        query.push({
          $match: {
            $or: [
              {
                title: {
                  $regex: search + '.*',
                  $options: 'si',
                },
              },
              {
                feedback: {
                  $regex: search + '.*',
                  $options: 'si',
                },
              },
            ],
          },
        });
      }
      if (product !== '') {
        query.push({ $match: { model: req.body.product } });
      }
      if (filterPrice !== 0) {
        const filter = {
          offerPrice: {
            $lte: _.toNumber(req.body.filterPrice),
          },
        };
        query.push({ $match: filter });
      }
      if (category !== '') {
        query.push({ $match: { category: req.body.category } });
      }
      const withoutlimit = Object.assign([], query);
      withoutlimit.push({ $count: 'count' });

      query.push(
        { $match: { model: { $ne: 0 } } },
        { $sort: sort },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
        {
          $project: {
            title: 1,
            price: 1,
            image: 1,
            offerPrice: 1,
            desc: 1,
            model: 1,
            category: 1,
            stockAvailability: 1,
          },
        }
      );
      const finalquery = [
        {
          $facet: {
            overall: withoutlimit,
            documentdata: query,
          },
        },
      ];

      const getUser = await GetAggregation('product', finalquery);
      let data = _.get(getUser, '0.documentdata', []);
      let fullcount = _.get(getUser, '0.overall.0.count', 0);
      if (data && data.length > 0) {
        res.json({
          status: 1,
          response: {
            result: data,
            fullcount: fullcount,
            length: data.length,
          },
        });
      } else {
        res.json({
          status: 0,
          response: {
            result: [],
            fullcount: fullcount,
            length: data.length,
          },
        });
      }
    } catch (error) {
      console.log('error', error);
      res.json({
        status: 0,
        response: 'Something went wrong',
        err: error,
      });
    }
  };
  return router;
};
