const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
const middlewares = require('../../model/middlewares.js');
const {
  ensureAuthorizedClient,
  ensureAuthorizedAdmin,
} = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var skill = require('../../controller/skill/skill')(app, io);

    app.post('/newSkill', ensureAuthorizedAdmin, skill.createSkill);

    app.get('/getSkill', ensureAuthorizedAdmin, skill.getSkill);
    app.get('/getSkillby/:id', ensureAuthorizedAdmin, skill.getskillById);
    app.put('/updateSkill/:id', ensureAuthorizedAdmin, skill.updateskill);

    app.delete('/deleteSkill/:id', ensureAuthorizedAdmin, skill.deleteSkill);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
