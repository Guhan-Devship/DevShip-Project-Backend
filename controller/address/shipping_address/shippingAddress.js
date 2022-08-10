const db = require('../../db_adaptor/mongodb.js');
const { validationResult } = require('express-validator');
const fs = require('fs');
const multer = require('multer');
var _ = require('lodash');
const path = require('path');
const { InsertDocument, UpdateOneDocument } = require('../../db_adaptor/mongodb.js');

module.exports = (app, io) => {
  var router = {};

  router.UserShippingAddress = async (req, res) => {
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
      const pincode = _.get(req.body, 'postal_code', 0);

      const client_Shipping_address = {
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
      let insert = await InsertDocument('shippingaddress', client_Shipping_address);
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

  //   router.getCart = async (req, res) => {
  //     let errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
  //     }
  //     try {
  //       let individualCart = await GetDocument('cart', { createdby: req.params.loginId }, {}, {});
  //       if (individualCart) {
  //         res.send(individualCart);
  //       }
  //     } catch (error) {
  //       res.send(error);
  //     }
  //   };

  //   router.deleteCart = async (req, res) => {
  //     let errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
  //     }
  //     try {
  //       let remove = await DeleteOneDocument('cart', { _id: req.params.id });
  //       if (remove) {
  //         res.json({ message: 'Deleted' });
  //       }
  //     } catch (error) {
  //       res.send(error);
  //     }
  //   };

  //   router.updateCart = async (req, res) => {
  //     let errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
  //     }
  //     try {
  //       let update = await UpdateOneDocument('cart', { _id: req.params.id }, { $set: req.body });
  //       if (update) {
  //         res.json({ message: 'Updated' });
  //       }
  //     } catch (error) {
  //       res.send(error);
  //     }
  //   };
  return router;
};
