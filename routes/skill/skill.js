const { check } = require('express-validator');
const CONFIG = require('../../config/config.js');
var library = require('../../model/library.js');
const middlewares = require('../../model/middlewares.js');
const { ensureAuthorizedClient } = require('../../model/security/ensureAuthorised.js');

module.exports = (app, io) => {
  try {
    var skill = require('../../controller/skill/skill')(app, io);

    app.post('/newSkill', skill.createSkill);

    app.get('/getSkill', skill.getSkill);
    app.get('/getSkillby/:id', skill.getskillById);
    app.put('/updateSkill/:id', skill.updateskill);

    app.delete('/deleteSkill/:id', skill.deleteSkill);
  } catch (error) {
    console.log(`Error occured ${error}`, error.message);
  }
};
