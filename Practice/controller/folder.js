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
  DeleteDocument,
} = require('../../controller/db_adaptor/mongodb.js');
const path = require('path');
const library = require('../../model/library.js');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

module.exports = (app, io) => {
  var router = {};

  router.createFolder = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const folder_name = _.get(req.body, 'folder_name', '');
    const mainFolderId = req.params.loginId;
    const folder = {
      folder_name,
      mainFolderId,
    };
    let insert = await InsertDocument('folder', folder);
    if (insert && insert._id) {
      res.json({ status: 1, message: 'Folder Created' });
    } else {
      res.json({ status: 0, message: 'Failed to create' });
    }
  };

  router.createSubFolder = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const folder_name = _.get(req.body, 'folder_name', '');
    const mainFolderId = req.params.id;
    const folder = {
      folder_name,
      mainFolderId,
    };
    let insert = await InsertDocument('folder', folder);
    if (insert && insert._id) {
      res.json({ status: 1, message: 'Folder Created' });
    } else {
      res.json({ status: 0, message: 'Failed to create' });
    }
  };

  router.getSubfolder = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let allFolder = await GetDocument('folder', { mainFolderId: req.params.id }, {}, {});
      if (allFolder) {
        res.send(allFolder);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.getfolder = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let allFolder = await GetDocument('folder', { mainFolderId: req.params.loginId }, {}, {});
      if (allFolder) {
        res.send(allFolder);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteFolder = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let remove = await DeleteOneDocument('folder', { _id: req.params.id });
      let update = await DeleteDocument('uploads', { folderId: req.params.id });
      if (remove && update) {
        res.json({ status: 1, message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.deleteSubFolder = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let remove = await DeleteOneDocument('folder', { _id: req.params.id });
      let update = await DeleteDocument('uploads', { folderId: req.params.id });
      if (remove && update) {
        res.json({ status: 1, message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.getFolderById = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let folder = await GetDocument('uploads', { folderId: req.params.id }, {}, {});
      if (folder) {
        res.send(folder);
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

  router.createFolderUploadFiles = async (req, res) => {
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
      const folderId = req.params.id;
      const multifiles = {
        files,
        folderId,
      };

      let insert = await InsertDocument('uploads', multifiles);
      if (insert && insert._id) {
        res.json({ status: 1, message: 'Uploaded successfull' });
      } else {
        res.json({ status: 0, message: 'Failed to upload' });
      }
    }
  };
  router.deleteFolderUploadFile = async (req, res) => {
    var data = {};
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const files = _.get(req.body, 'files', '');
    try {
      let remove = await UpdateOneDocument(
        'uploads',
        { folderId: req.params.id },
        { $pull: { files: files } },
        {}
      );
      unlinkAsync(files)
        .then((resolved) => {
          data.status = 1;
          data.response = resolved;
          data.message = res.json({ status: 1, message: 'Removed' });
        })
        .catch((error) => {
          data.status = 0;
          data.message = error;
        });
    } catch (error) {
      res.send(error);
    }
  };
  return router;
};
