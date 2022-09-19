const db = require('../../controller/db_adaptor/mongodb.js');
var mongoose = require('mongoose');
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
  GetOneDocument,
} = require('../../controller/db_adaptor/mongodb.js');
const path = require('path');
const library = require('../../model/library.js');
const { isObjectId, ObjectId } = require('../../model/common.js');

module.exports = (app, io) => {
  var router = {};

  router.createContacts = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const name = _.get(req.body, 'name', '');
    const organisation = _.get(req.body, 'organisation', '');
    const gender = _.get(req.body, 'gender', '');
    const mobile = _.get(req.body, 'mobile', 0);
    const email = _.get(req.body, 'email', '');
    const message = _.get(req.body, 'message', '');
    const address = JSON.parse(_.get(req.body, 'address', ''));
    const createdby = req.params.loginId;

    const contact = {
      name,
      organisation,
      gender,
      mobile,
      email,
      message,
      address,
      createdby,
    };

    let insert = await InsertDocument('contact', contact);
    if (insert && insert._id) {
      res.json({ status: 1, message: 'Contact Created' });
    } else {
      res.json({ status: 0, message: 'Failed to create order' });
    }
  };

  router.getContact = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let contact = await GetDocument('contact', {}, {}, {});
      // let query = [];
      // query.push({
      //   $lookup: {
      //     from: 'address',
      //     localField: '_id',
      //     foreignField: 'createdby',
      //     pipeline: [
      //       {
      //         $project: {
      //           address: 1,
      //           line1: 1,
      //           line2: 1,
      //           city: 1,
      //           state: 1,
      //           country: 1,
      //           pincode: 1,
      //         },
      //       },
      //     ],
      //     as: 'Address',
      //   },
      // });
      // let contact = await GetAggregation('contact', query);
      if (contact) {
        res.send(contact);
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.getContactById = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let contact = await GetOneDocument('contact', { _id: ObjectId(req.params.id) }, {}, {});
      if (contact) {
        res.send(contact);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteContact = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let remove = await DeleteOneDocument('contact', { _id: ObjectId(req.params.id) });
      if (remove) {
        res.json({ message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.updateContact = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      const name = _.get(req.body, 'name', '');
      const organisation = _.get(req.body, 'organisation', '');
      const gender = _.get(req.body, 'gender', '');
      const mobile = _.get(req.body, 'mobile', 0);
      const email = _.get(req.body, 'email', '');
      const message = _.get(req.body, 'message', '');
      const address = JSON.parse(_.get(req.body, 'address', ''));

      const contact = {
        name,
        organisation,
        gender,
        mobile,
        email,
        message,
        address,
      };
      let update = await UpdateOneDocument('contact', { _id: ObjectId(req.params.id) }, contact);
      if (update) {
        res.json({ message: 'Updated' });
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteContactAddress = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const userId = req.params.userId;
    try {
      let remove = await UpdateOneDocument(
        'contact',
        { _id: userId },
        { $pull: { address: { _id: ObjectId(req.params.id) } } },
        {}
      );
      if (remove) {
        res.json({ message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  return router;
};
