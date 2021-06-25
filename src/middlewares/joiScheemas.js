const Joi = require('joi');

const schemas = {
  userPOST: Joi.object().keys({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().min(6).max(30).required(),
    confirm_password: Joi.ref("password")
  })
};

module.exports = schemas;
