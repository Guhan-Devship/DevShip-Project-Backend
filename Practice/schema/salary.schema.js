var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SALARY_SCHEMA = {};
SALARY_SCHEMA.SALARY = {
  employee: { type: String },
  dept: { type: String },
  salary: { type: String },
  fiscal_year: { type: String },
};

module.exports = SALARY_SCHEMA;
