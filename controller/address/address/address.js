const db = require('../../db_adaptor/mongodb.js');
const { validationResult } = require('express-validator');
const fs = require('fs');
const multer = require('multer');
var _ = require('lodash');
const path = require('path');
const {
  InsertDocument,
  UpdateOneDocument,
  GetOneDocument,
  GetDocument,
  DeleteOneDocument,
  UpdateManyDocument,
} = require('../../db_adaptor/mongodb.js');

module.exports = (app, io) => {
  var router = {};

  router.userAddress = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.errors[0].msg });
    }
    try {
      const line1 = _.get(req.body, 'line1', '');
      const line2 = _.get(req.body, 'line2', '');
      const state = _.get(req.body, 'state', '');
      const city = _.get(req.body, 'city', '');
      const country = _.get(req.body, 'country', '');
      const pincode = _.get(req.body, 'pincode', '');
      const createdby = _.get(req.body, 'createdby', '');

      const client_address = {
        line1,
        line2,
        state,
        city,
        country,
        pincode,
        createdby,
      };
      console.log(createdby);
      let insert = await InsertDocument('address', client_address);
      if (insert) {
        await UpdateOneDocument(
          'contact',
          { _id: req.params.id },
          {
            $push: { address: insert._id },
          }
        );
        res.json({ message: 'Created' });
      } else {
        res.json({ message: 'something wrong' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  router.getAddress = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let user = await GetOneDocument('contact', { _id: req.params.id }, {}, {});

      const list = await Promise.all(
        user.address.map((item) => {
          return GetOneDocument('address', { _id: item }, {}, {});
        })
      );
      res.send(list);
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteBillingAddress = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const userId = req.params.userId;
    try {
      await DeleteOneDocument('billingaddress', { _id: req.params.id });
      try {
        await UpdateOneDocument(
          'client',
          {
            _id: userId,
          },
          { $pull: { billing_address: req.params.id } },
          {}
        );
        res.json({ message: 'Delete & updated' });
      } catch (error) {}
    } catch (error) {
      res.send(error);
    }
  };

  router.updateBillingAddress = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      await UpdateOneDocument('billingaddress', { _id: req.params.id }, { $set: req.body });

      if (!req.billingAddress) {
        await UpdateManyDocument(
          'billingaddress',
          { _id: { $ne: req.params.id }, billingAddress: true },
          { billingAddress: false },
          {}
        );
      }
      res.json({ message: 'Updated' });
    } catch (error) {
      res.send(error);
    }
  };
  return router;
};
