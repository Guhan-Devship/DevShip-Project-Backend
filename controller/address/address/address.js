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
      let user = await GetDocument('address', { createdby: req.params.id }, {}, {});
      res.send(user);
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteAddress = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      await DeleteOneDocument('address', { _id: req.params.id });
    } catch (error) {
      res.send(error);
    }
  };

  router.updateAddress = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      await UpdateOneDocument('address', { _id: req.params.id }, { $set: req.body });
      res.json({ message: 'Updated' });
    } catch (error) {
      res.send(error);
    }
  };
  router.UpdateContactAddress = async (req, res) => {
    var data = {};
    data.status = 0;

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
      const address = _.get(req.body, 'address', Boolean);

      const conatctaddress = {
        line1,
        line2,
        state,
        city,
        country,
        pincode,
        address,
      };
      let update = await UpdateOneDocument(
        'address',
        { id: req.params.id },
        { $set: { conatctaddress } },
        {}
      );
      if (update) {
        res.json({ message: 'Updated' });
      } else {
        res.json({ message: 'something wrong' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return router;
};
