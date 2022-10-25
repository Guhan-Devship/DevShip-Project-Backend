const db = require('../../controller/db_adaptor/mongodb.js');
const { validationResult } = require('express-validator');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcrypt');
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
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('../../model/common.js');

module.exports = (app, io) => {
  var router = {};

  router.createSubadmin = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    let getUserEmail = await GetOneDocument('subadmins', { email: req.body.email }, {}, {});
    // let getAdmin = await GetOneDocument('admins', { role: 'admin' }, {}, {});
    if (getUserEmail) {
      return res.json({ status: 0, message: 'Email already exists' });
    }

    const name = _.get(req.body, 'name', '');
    const last_name = _.get(req.body, 'last_name', '');
    const email = _.get(req.body, 'email', '');
    const role = _.get(req.body, 'role', '');
    const access = _.get(req.body, 'access', '');
    const password = _.get(req.body, 'password', '');
    const confirmPassword = _.get(req.body, 'confirmPassword', '');
    const components = _.get(req.body, 'components', '');
    const users = _.get(req.body, 'users', '');
    const products = _.get(req.body, 'products', '');
    const orders = _.get(req.body, 'orders', '');
    const orderDelete = _.get(req.body, 'orderDelete', '');
    const userView = _.get(req.body, 'userView', '');
    const userEdit = _.get(req.body, 'userEdit', '');
    const userDelete = _.get(req.body, 'userDelete', '');
    const productDelete = _.get(req.body, 'productDelete', '');
    const productView = _.get(req.body, 'productView', '');
    const productEdit = _.get(req.body, 'productEdit', '');
    const utilities = _.get(req.body, 'utilities', '');
    const utilitiContact = _.get(req.body, 'utilitiContact', '');
    const contactDelete = _.get(req.body, 'contactDelete', '');
    const contactCreate = _.get(req.body, 'contactCreate', '');
    const contactEdit = _.get(req.body, 'contactEdit', '');
    const contactView = _.get(req.body, 'contactView', '');
    const utilitiForm = _.get(req.body, 'utilitiForm', '');
    const utilitiPricing = _.get(req.body, 'utilitiPricing', '');
    const pricingCreate = _.get(req.body, 'pricingCreate', '');
    const pricingEdit = _.get(req.body, 'pricingEdit', '');
    const pricingDelete = _.get(req.body, 'pricingDelete', '');
    const utilitiRole = _.get(req.body, 'utilitiRole', '');
    const roleCreate = _.get(req.body, 'roleCreate', '');
    const roleEdit = _.get(req.body, 'roleEdit', '');
    const roleDelete = _.get(req.body, 'roleDelete', '');
    const utilitiSkill = _.get(req.body, 'utilitiSkill', '');
    const skillCreate = _.get(req.body, 'skillCreate', '');
    const skillEdit = _.get(req.body, 'skillEdit', '');
    const skillDelete = _.get(req.body, 'skillDelete', '');
    const subadmin = {
      email,
      password,
      name,
      access,
      last_name,
      role,
      components,
      users,
      products,
      orders,
      orderDelete,
      userView,
      userEdit,
      userDelete,
      productDelete,
      productView,
      productEdit,
      utilities,
      utilitiContact,
      contactDelete,
      contactCreate,
      contactEdit,
      contactView,
      utilitiForm,
      utilitiPricing,
      pricingCreate,
      pricingEdit,
      pricingDelete,
      utilitiRole,
      roleCreate,
      roleEdit,
      roleDelete,
      utilitiSkill,
      skillCreate,
      skillEdit,
      skillDelete,
    };

    if (req.body.password === req.body.confirmPassword) {
      subadmin.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
    } else {
      return res.json({ status: 0, message: 'Password not match' });
    }

    let insert = await InsertDocument('subadmins', subadmin);

    if (insert && insert._id) {
      //   const messageUser = `You have successfully signed up to Kingdom Granites`;
      // const messageAdmin = `New user ${insert.first_name} ${insert.surname} signed up`;
      // const sender = insert._id;
      // console.log(getAdmin);
      // const receiver = getAdmin._id;

      // await push_notification.addnotification(
      //   sender,
      //   receiver,
      //   messageAdmin,
      //   'client_register',
      //   'admin'
      // );
      //   await push_notification.addnotification(
      //     getAdmin._id,
      //     messageUser,
      //     "user_register",
      //     options,
      //     "user"
      //   );
      res.json({ status: 1, message: 'subadmin Created' });
    } else {
      res.json({ status: 0, message: 'Failed to create subadmin' });
    }
  };

  router.getSubamins = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let allsubadmins = await GetDocument('subadmins', {}, {}, {});
      if (allsubadmins) {
        res.send(allsubadmins);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.deleteSubadmin = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let remove = await DeleteOneDocument('subadmins', { _id: req.params.id });
      if (remove) {
        res.json({ message: 'Deleted' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  router.getsubadminById = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      let role = await GetOneDocument('subadmins', { _id: req.params.id }, {}, {});
      if (role) {
        res.send(role);
      }
    } catch (error) {
      res.send(error);
    }
  };

  router.requestloginSubadmin = async (req, res) => {
    try {
      const { subadminId } = req.params;
      const uuid = uuidv4();

      const update = await UpdateOneDocument(
        'subadmins',
        { _id: ObjectId(subadminId) },
        { uuid },
        {}
      );

      if (update.nModified === 0) {
        return res.json({ status: 0, message: 'Client not found' });
      }

      res.json({ status: 1, response: { uuid } });
    } catch (error) {
      console.log(error);
      res.json({ Status: 0, message: 'Server Error' });
    }
  };

  router.loginAsSubadmin = async (req, res) => {
    try {
      const { uuid } = req.params;

      let user = await GetOneDocument('subadmins', { uuid }, {}, {});

      if (user !== undefined && user !== null) {
        await UpdateOneDocument('subadmins', { uuid }, { $unset: { uuid: '' } }, {});

        library.jwtSign({ email: user.email }, (error, authToken) => {
          if (error) {
            res.json({ status: 0, response: 'Invalid Credentials' });
          } else {
            res.json({
              status: 1,
              authToken,
              userId: user._id,
              role: user.role,
              message: 'Login Successfully',
            });
          }
        });
      } else {
        res.json({ status: 0, response: 'Not Found' });
      }
    } catch (err) {
      console.log('err in  /loginAsSubadmin-->', err);
      res.json({ status: 0, message: 'Server Error' });
    }
  };

  router.updateSubAdmin = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 0, errors: errors.errors[0].msg });
    }
    try {
      const name = _.get(req.body, 'name', '');
      const last_name = _.get(req.body, 'last_name', '');
      const email = _.get(req.body, 'email', '');
      const phone = _.get(req.body, 'phone', '');
      const role = _.get(req.body, 'role', '');
      const components = _.get(req.body, 'components', '');
      const users = _.get(req.body, 'users', '');
      const products = _.get(req.body, 'products', '');
      const orders = _.get(req.body, 'orders', '');
      const orderDelete = _.get(req.body, 'orderDelete', '');
      const userView = _.get(req.body, 'userView', '');
      const userEdit = _.get(req.body, 'userEdit', '');
      const userDelete = _.get(req.body, 'userDelete', '');
      const productDelete = _.get(req.body, 'productDelete', '');
      const productView = _.get(req.body, 'productView', '');
      const productEdit = _.get(req.body, 'productEdit', '');
      const utilities = _.get(req.body, 'utilities', '');
      const utilitiContact = _.get(req.body, 'utilitiContact', '');
      const contactDelete = _.get(req.body, 'contactDelete', '');
      const contactCreate = _.get(req.body, 'contactCreate', '');
      const contactEdit = _.get(req.body, 'contactEdit', '');
      const contactView = _.get(req.body, 'contactView', '');
      const utilitiForm = _.get(req.body, 'utilitiForm', '');
      const utilitiPricing = _.get(req.body, 'utilitiPricing', '');
      const pricingCreate = _.get(req.body, 'pricingCreate', '');
      const pricingEdit = _.get(req.body, 'pricingEdit', '');
      const pricingDelete = _.get(req.body, 'pricingDelete', '');
      const utilitiRole = _.get(req.body, 'utilitiRole', '');
      const roleCreate = _.get(req.body, 'roleCreate', '');
      const roleEdit = _.get(req.body, 'roleEdit', '');
      const roleDelete = _.get(req.body, 'roleDelete', '');
      const utilitiSkill = _.get(req.body, 'utilitiSkill', '');
      const skillCreate = _.get(req.body, 'skillCreate', '');
      const skillEdit = _.get(req.body, 'skillEdit', '');
      const skillDelete = _.get(req.body, 'skillDelete', '');
      const subadmin = {
        name,
        last_name,
        phone,
        email,
        role,
        components,
        users,
        products,
        orders,
        orderDelete,
        userView,
        userEdit,
        userDelete,
        productDelete,
        productView,
        productEdit,
        utilities,
        utilitiContact,
        contactDelete,
        contactCreate,
        contactEdit,
        contactView,
        utilitiForm,
        utilitiPricing,
        pricingCreate,
        pricingEdit,
        pricingDelete,
        utilitiRole,
        roleCreate,
        roleEdit,
        roleDelete,
        utilitiSkill,
        skillCreate,
        skillEdit,
        skillDelete,
      };
      let update = await UpdateOneDocument('subadmins', { _id: req.params.id }, subadmin);
      if (update) {
        res.json({ message: 'Updated' });
      }
    } catch (error) {
      res.send(error);
    }
  };
  return router;
};
