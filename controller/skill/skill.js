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

  router.createSkill = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const skill_name = _.get(req.body, 'skill_name', '');
    const skill = {
      skill_name,
    };
    let insert = await InsertDocument('skill', skill);
    if (insert && insert._id) {
      res.json({ status: 1, message: 'Skill Name Created' });
    } else {
      res.json({ status: 0, message: 'Failed to create skill Name' });
    }
  };

  router.getSkill = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let allskill = await GetDocument('skill', {}, {}, {});
      if (allskill) {
        res.send(allskill);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteSkill = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let remove = await DeleteOneDocument('skill', { _id: req.params.id });
      if (remove) {
        res.json({ message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.getskillById = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let skill = await GetOneDocument('skill', { _id: req.params.id }, {}, {});
      if (skill) {
        res.send(skill);
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.updateskill = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      const skill_name = _.get(req.body, 'skill_name', '');

      const data = {
        skill_name,
      };
      let update = await UpdateOneDocument('skill', { _id: req.params.id }, data);
      if (update) {
        res.json({ message: 'Updated' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  return router;
};
