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
  GetOneDocument,
  UpdateManyDocument,
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
    const role = _.get(req.body, 'role', '');
    const skill = _.get(req.body, 'skill', [{}]);
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
      skill,
      role,
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

  router.getList = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let form = await GetDocument('form', {}, {}, {});
      if (form) {
        res.send(form);
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.getformById = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      console.log(req.params.id);
      let contact = await GetOneDocument('form', { _id: req.params.id }, {}, {});
      if (contact) {
        res.send(contact);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteForm = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let remove = await DeleteOneDocument('form', { _id: req.params.id });
      if (remove) {
        res.json({ message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.updateForm = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      const first_name = _.get(req.body, 'first_name', '');
      const surname = _.get(req.body, 'surname', '');
      const gender = _.get(req.body, 'gender', '');
      const role = _.get(req.body, 'role', '');
      const email = _.get(req.body, 'email', '');
      const phone = _.get(req.body, 'phone', '');

      const formList = {
        first_name,
        surname,
        gender,
        role,
        email,
        phone,
      };
      let update = await UpdateOneDocument('form', { _id: req.params.id }, formList);
      if (update) {
        res.json({ message: 'Updated' });
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.moveformById = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let movedata = await GetOneDocument('form', { _id: req.params.id }, {}, {});
      if (movedata) {
        let data = {
          first_name: movedata.first_name,
          surname: movedata.surname,
          gender: movedata.gender,
          email: movedata.email,
          password: movedata.password,
          phone: movedata.phone,
          role: movedata.role,
          skill: movedata.skill,
          formID: movedata._id,
        };
        let insert = await InsertDocument('client', data);
        if (insert) {
          let update = await UpdateOneDocument(
            'form',
            { _id: req.params.id },
            { movedToUser: true },
            {}
          );
          if (update) {
            res.json({ message: 'Moved to Users' });
          }
        }
        // if (insert) {
        //   let remove = await DeleteOneDocument('form', { _id: req.params.id });
        //   if (remove) {
        //     res.json({ message: 'Moved to Users' });
        //   }
        // }
      }
    } catch (error) {
      res.send(error);
    }
  };
  return router;
};
