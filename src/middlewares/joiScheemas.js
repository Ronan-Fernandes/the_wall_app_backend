const Joi = require("joi");

const schemas = {
  userPOST: Joi.object().keys({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().min(6).max(30).required(),
    confirm_password: Joi.ref("password"),
  }),
  userLoginPOST: Joi.object().keys({
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().min(6).max(30).required(),
  }),
  createEditPostPOST: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
  paramsId: Joi.object({
    id: Joi.string().required(),
  }),
};

module.exports = schemas;
