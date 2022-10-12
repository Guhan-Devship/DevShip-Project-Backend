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
  GetOneDocument,
} = require('../../controller/db_adaptor/mongodb.js');
const path = require('path');
const library = require('../../model/library.js');

module.exports = (app, io) => {
  var router = {};
  router.createUpload = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }

    let files = [];
    if (req.files.files.length > 8) {
      res.json({ status: 0, message: 'Only 8 files' });
    } else {
      req.files.files.map((e) => {
        files.push(library.get_attachment(e.destination, e.filename));
      });
      const multifiles = {
        files,
      };

      let insert = await InsertDocument('uploads', multifiles);
      if (insert && insert._id) {
        res.json({ status: 1, message: 'Uploaded successfull' });
      } else {
        res.json({ status: 0, message: 'Failed to upload' });
      }
    }
  };
  router.getUploadFiles = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let allImages = await GetDocument('uploads', {}, {}, {});
      if (allImages) {
        res.send(allImages);
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.deleteUploadFile = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const files = _.get(req.body, 'files', '');
    console.log(files);
    try {
      let remove = await UpdateOneDocument(
        'uploads',
        { _id: req.params.id },
        { $pull: { files: files } },
        {}
      );
      console.log(remove);
      if (remove) {
        res.json({ status: 1, message: 'Removed' });
      }
    } catch (error) {
      res.send(error);
    }
  };

  return router;
};
