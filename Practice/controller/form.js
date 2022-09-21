const db = require('../../controller/db_adaptor/mongodb');
const { validationResult } = require('express-validator');
const fs = require('fs');
const bcrypt = require('bcrypt');
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
const { rearg } = require('lodash');

module.exports = (app, io) => {
  var router = {};
  router.createForm = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const first_name = _.get(req.body, 'first_name', '');
    const surname = _.get(req.body, 'surname', '');
    const email = _.get(req.body, 'email', '');
    const agree_terms = _.get(req.body, 'agree_terms');
    const gender = _.get(req.body, 'gender', '');
    const password = _.get(req.body, 'password', '');
    const confirmPassword = _.get(req.body, 'confirmPassword', '');
    const phone = _.get(req.body, 'phone', '');
    const createdby = req.params.loginId;

    const form = {
      first_name,
      surname,
      email,
      password,
      agree_terms,
      phone,
      gender,
      createdby,
    };
    if (req.body.password === req.body.confirmPassword) {
      form.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
    } else {
      return res.json({ status: 0, message: 'Password not match' });
    }

    let insert = await InsertDocument('form', form);
    if (insert && insert._id) {
      res.json({ status: 1, message: 'Form Submitted' });
    } else {
      res.json({ status: 0, message: 'Failed' });
    }
  };
  //   router.getImages = async (req, res) => {
  //     let errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
  //     }
  //     try {
  //       let allImages = await GetDocument('multiImage', {}, {}, {});
  //       if (allImages) {
  //         res.send(allImages);
  //       }
  //     } catch (error) {
  //       res.send(error);
  //     }
  //   };
  return router;
};
