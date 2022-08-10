var CONFIG = require('../../config/config');
var jwt = require('jsonwebtoken');
const { GetOneDocument } = require('../../controller/db_adaptor/mongodb.js');
const req = require('express/lib/request');

const ensureAuthorizedAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, CONFIG.SECRET_KEY, async (err, decoded) => {
      if (err || !decoded.email) {
        const data = {};
        data.response = 'Unauthorized Access';
        data.message = 'Session Expired';
        data.status = '00';
        res.send(data);
      } else {
        let collection = decoded.role === 'admin' ? 'admins' : 'subadmins';

        let mainAdmin = await GetOneDocument('admins', { status: 1 }, { _id: 1 }, {});

        let admins = await GetOneDocument(collection, { email: decoded.email, status: 1 }, {}, {});

        if (admins === null) {
          const data = {};
          data.response = 'Unauthorized Access';
          data.status = '00';
          res.send(data);
        } else {
          req.params.mainAdminId = mainAdmin._id;
          req.params.loginId = admins._id;
          req.params.loginData = admins;
          next();
        }
      }
    });
  } else {
    res.send('Unauthorized Access');
  }
};

const ensureAuthorizedClient = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, CONFIG.SECRET_KEY, async (err, decoded) => {
      if (err || !decoded._id) {
        const data = {};
        data.response = 'Unauthorized Access';
        data.message = 'Session Expired';
        data.status = '00';
        res.send(data);
      } else {
        let user = await GetOneDocument('client', { _id: decoded._id, status: 1 }, {}, {});
        req.userId = decoded.id;

        if (user === null) {
          const data = {};
          data.response = 'Unauthorized Access';
          data.status = '00';
          res.send(data);
        } else {
          req.params.loginId = user._id;
          req.params.loginData = user;
          // req.params.adminId = admins._id;
          next();
        }
      }
    });
  } else {
    res.send('Unauthorized Access');
  }
};

function authenticate(req, res, next) {
  // Check token present in header
  if (req.headers.authorization) {
    let decode = jwt.verify(req.headers.authorization, 'KeyCode');
    if (decode) {
      req.userId = decode.id;
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = {
  ensureAuthorizedAdmin,
  ensureAuthorizedClient,
  authenticate,
};
