const db = require('../../controller/db_adaptor/mongodb.js');
const { validationResult } = require('express-validator');
const fs = require('fs');
const multer = require('multer');
var _ = require('lodash');
const {
  InsertDocument,
  GetDocument,
  DeleteOneDocument,
  GetOneDocument,
  UpdateOneDocument,
} = require('../../controller/db_adaptor/mongodb.js');
const path = require('path');
const library = require('../../model/library.js');

module.exports = (app, io) => {
  var router = {};

  router.createRole = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const role_name = _.get(req.body, 'role_name', '');
    const role = {
      role_name,
    };
    let insert = await InsertDocument('role', role);
    if (insert && insert._id) {
      res.json({ status: 1, message: 'Role Name Created' });
    } else {
      res.json({ status: 0, message: 'Failed to create Role Name' });
    }
  };

  router.getRole = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let allrole = await GetDocument('role', {}, {}, {});
      if (allrole) {
        res.send(allrole);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteRole = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let remove = await DeleteOneDocument('role', { _id: req.params.id });
      if (remove) {
        res.json({ message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.getroleById = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let role = await GetOneDocument('role', { _id: req.params.id }, {}, {});
      if (role) {
        res.send(role);
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.updateRole = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      const role_name = _.get(req.body, 'role_name', '');

      const data = {
        role_name,
      };
      let update = await UpdateOneDocument('role', { _id: req.params.id }, data);
      if (update) {
        res.json({ message: 'Updated' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  return router;
};
