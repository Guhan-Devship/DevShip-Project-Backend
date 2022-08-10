const db = require('../../controller/db_adaptor/mongodb.js');
const { validationResult } = require('express-validator');
const fs = require('fs');
const multer = require('multer');
var _ = require('lodash');
const {
  InsertDocument,
  GetDocument,
  DeleteOneDocument,
} = require('../../controller/db_adaptor/mongodb.js');
const path = require('path');
const library = require('../../model/library.js');

module.exports = (app, io) => {
  var router = {};

  router.createCategory = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const image = library.get_attachment(
      req.files.image[0].destination,
      req.files.image[0].filename
    );
    const title = _.get(req.body, 'title', '');
    const category = {
      title,
      image,
    };
    let insert = await InsertDocument('category', category);
    if (insert && insert._id) {
      res.json({ status: 1, message: 'Category Created' });
    } else {
      res.json({ status: 0, message: 'Failed to create category' });
    }
  };

  router.getCategory = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let allCategory = await GetDocument('category', {}, {}, {});
      if (allCategory) {
        res.send(allCategory);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteCategory = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let remove = await DeleteOneDocument('category', { _id: req.params.id });
      if (remove) {
        res.json({ message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  return router;
};
