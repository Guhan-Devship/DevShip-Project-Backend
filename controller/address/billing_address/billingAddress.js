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

  router.UserBillingAddress = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.errors[0].msg });
    }
    try {
      const name = _.get(req.body, 'name', '');
      const phone = _.get(req.body, 'phone', '');
      const email = _.get(req.body, 'email', '');
      const line1 = _.get(req.body, 'line1', '');
      const line2 = _.get(req.body, 'line2', '');
      const state = _.get(req.body, 'state', '');
      const city = _.get(req.body, 'city', '');
      const country = _.get(req.body, 'country', '');
      const pincode = _.get(req.body, 'pincode', '');

      const client_billing_address = {
        name,
        phone,
        email,
        line1,
        line2,
        state,
        city,
        country,
        pincode,
      };
      let insert = await InsertDocument('billingaddress', client_billing_address);
      if (insert) {
        await UpdateOneDocument(
          'client',
          { _id: req.params.id },
          {
            $push: { billing_address: insert._id },
          }
        );
        res.json({ message: 'Updated' });
      } else {
        res.json({ message: 'something wrong' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  router.getBillingAddress = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let user = await GetOneDocument('client', { _id: req.params.id }, {}, {});
      const list = await Promise.all(
        user.billing_address.map((item) => {
          return GetOneDocument('billingaddress', { _id: item }, {}, {});
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
