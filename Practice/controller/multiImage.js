const db = require('../../controller/db_adaptor/mongodb');
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
  router.createMultiUpload = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }

    let image = [];
    if (req.files.image.length > 5) {
      res.json({ status: 0, message: 'Only 5 images' });
    } else {
      req.files.image.map((e) => {
        image.push(library.get_attachment(e.destination, e.filename));
      });
      const createdby = req.params.loginId;
      const multiImage = {
        image,
        createdby,
      };

      let insert = await InsertDocument('multiImage', multiImage);
      if (insert && insert._id) {
        res.json({ status: 1, message: 'Category Created' });
      } else {
        res.json({ status: 0, message: 'Failed to create category' });
      }
    }
  };
  router.getImages = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let allImages = await GetDocument('multiImage', {}, {}, {});
      if (allImages) {
        res.send(allImages);
      }
    } catch (error) {
      res.send(error);
    }
  };
  return router;
};
