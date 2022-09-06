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

  router.createlist = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    const student = _.get(req.body, 'student', '');
    const homework = JSON.parse(_.get(req.body, 'homework', ''));
    const quiz = JSON.parse(_.get(req.body, 'quiz', ''));
    const extraCredit = _.get(req.body, 'extraCredit', 0);

    const data = {
      student,
      homework,
      quiz,
      extraCredit,
    };

    let insert = await InsertDocument('mark', data);
    if (insert && insert._id) {
      res.json({ status: 1, message: 'list Created' });
    } else {
      res.json({ status: 0, message: 'Failed to create order' });
    }
  };
  // AddField
  router.getOrder_addFields = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      // let order = await GetDocument('order', {}, {}, {});
      let query = [];
      query.push({
        $addFields: {
          total: { $multiply: ['$offerPrice', '$quantity'] },
          offer: '20%',
        },
      });

      let order = await GetAggregation('order', query);
      if (order) {
        res.send(order);
      }
    } catch (error) {
      res.send(error);
    }
  };
  //bucket
  router.getOrder_bucket = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      // let order = await GetDocument('order', {}, {}, {});
      let query = [];
      query.push(
        {
          $bucket: {
            groupBy: '$year_born',
            boundaries: ['1840', '1850', '1860', '1870', '1880'],
            default: 'Other',
            output: {
              count: { $sum: 1 },
              artists: {
                $push: {
                  name: { $concat: ['$first_name', ' ', '$last_name'] },
                  year_born: '$year_born',
                },
              },
            },
          },
        },
        {
          $match: { count: { $lt: 3 } },
        }
      );

      let order = await GetAggregation('practice', query);
      if (order) {
        res.send(order);
      }
    } catch (error) {
      res.send(error);
    }
  };
  //group
  router.getOrder_group = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      // let order = await GetDocument('order', {}, {}, {});
      let query = [];
      query.push({
        $group: {
          _id: '$title',
          count: { $sum: 1 },
          totalSaleAmount: { $sum: { $multiply: ['$offerPrice', '$quantity'] } },
          averageQuantity: { $avg: '$quantity' },
        },
      });

      let order = await GetAggregation('order', query);
      if (order) {
        res.send(order);
      }
    } catch (error) {
      res.send(error);
    }
  };
  //merge
  router.getOrder_merge = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let query = [];
      query.push({
        $merge: {
          into: { db: 'reporting', coll: 'orgArchive' },
          on: ['dept', 'fiscal_year'],
        },
      });

      let order = await GetAggregation('salary', query);
      if (order) {
        res.send(order);
      }
    } catch (error) {
      res.send(error);
    }
  };

  //project
  router.getOrder_project = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let query = [];
      query.push({
        $project: {
          name: 1,
          organisation: 1,
          mobile: 1,
          message: 1,
          email: 1,
          gender: 1,
          OrganisationName: { $substr: ['$organisation', 0, 4] },
          Organisationyear: { $substr: ['$organisation', 4, -1] },
        },
      });

      let order = await GetAggregation('contact', query);
      if (order) {
        res.send(order);
      }
    } catch (error) {
      res.send(error);
    }
  };
  //Filter
  router.getOrder_filter = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let query = [];

      query.push({
        $project: {
          name: 1,
          organisation: 1,
          mobile: 1,
          address: {
            $filter: {
              input: '$address',
              as: 'address',
              cond: { $eq: ['$$address.city', 'Chennai'] },
            },
          },
        },
      });
      let order = await GetAggregation('contact', query);
      if (order) {
        res.send(order);
      }
    } catch (error) {
      res.send(error);
    }
  };
  //set & unset
  router.getOrder_mark = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let query = [];

      query.push(
        {
          $set: {
            totalHomework: { $sum: '$homework' },
            totalQuiz: { $sum: '$quiz' },
          },
        },
        {
          $set: {
            totalScore: { $add: ['$totalHomework', '$totalQuiz', '$extraCredit'] },
          },
        },
        {
          $unset: ['extraCredit'],
        }
      );
      let order = await GetAggregation('mark', query);
      if (order) {
        res.send(order);
      }
    } catch (error) {
      res.send(error);
    }
  };
  //lookup
  router.getOrder_lookup = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      // let order = await GetDocument('order', {}, {}, {});
      let query = [];
      query.push({
        $lookup: {
          from: 'billingaddress',
          localField: 'createdby',
          foreignField: 'createdby',
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
                phone: 1,
                billingAddress: 1,
                line1: 1,
                line2: 1,
                city: 1,
                state: 1,
                country: 1,
                pincode: 1,
              },
            },
          ],
          as: 'Address',
        },
      });
      let order = await GetAggregation('order', query);
      if (order) {
        res.send(order);
      }
    } catch (error) {
      res.send(error);
    }
  };
  // Cond
  router.getOrder_cond = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      // let order = await GetDocument('order', {}, {}, {});
      let query = [];
      query.push({
        $project: {
          title: 1,
          offerPrice: 1,
          quantity: 1,
          discount: {
            $cond: { if: { $gte: ['$quantity', 2] }, then: 30, else: 20 },
          },
        },
      });

      let order = await GetAggregation('order', query);
      if (order) {
        res.send(order);
      }
    } catch (error) {
      res.send(error);
    }
  };

  return router;
};
