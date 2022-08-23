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
  GetAggregation,
} = require('../../controller/db_adaptor/mongodb.js');
const path = require('path');
const library = require('../../model/library.js');

module.exports = (app, io) => {
  var router = {};

  router.createOrder = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const title = _.get(req.body, 'title', '');
    const image = _.get(req.body, 'image', '');
    const price = _.get(req.body, 'price', 0);
    const offerPrice = _.get(req.body, 'offerPrice', 0);
    const quantity = _.get(req.body, 'quantity', 0);
    const createdby = req.params.loginId;
    // const name = _.get(req.body, 'name', '');
    // const phone = _.get(req.body, 'phone', '');
    // const email = _.get(req.body, 'email', '');
    // const line1 = _.get(req.body, 'line1', '');
    // const line2 = _.get(req.body, 'line2', '');
    // const state = _.get(req.body, 'state', '');
    // const city = _.get(req.body, 'city', '');
    // const country = _.get(req.body, 'country', '');
    // const pincode = _.get(req.body, 'pincode', '');

    const order = {
      title,
      image,
      price,
      offerPrice,
      quantity,
      createdby,
      // name,
      // phone,
      // email,
      // line1,
      // line2,
      // state,
      // city,
      // country,
      // pincode,
    };

    let insert = await InsertDocument('order', order);
    if (insert && insert._id) {
      res.json({ status: 1, message: 'order Created' });
    } else {
      res.json({ status: 0, message: 'Failed to create order' });
    }
  };

  router.getOrder = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      // let order = await GetDocument('order', {}, {}, {});
      let query = [];
      query.push({
        $lookup: {
          from: 'billingaddress',
          localField: 'createdby',
          foreignField: 'createdby',
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
                phone: 1,
                billingAddress: 1,
                line1: 1,
                line2: 1,
                city: 1,
                state: 1,
                country: 1,
                pincode: 1,
              },
            },
          ],
          as: 'Address',
        },
      });
      let order = await GetAggregation('order', query);
      if (order) {
        res.send(order);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteOrder = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let remove = await DeleteOneDocument('order', { _id: req.params.id });
      if (remove) {
        res.json({ message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  return router;
};
