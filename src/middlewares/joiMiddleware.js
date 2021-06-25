const Joi = require('joi');
const schemas = require('./joiScheemas');

const middleware = (schema, property) => (req, res, next) => {
  try {
    const { error } = schema.validate(req[property]);
    
    if (!error) return next();
    
    const { details } = error; 
    const message = details.map(item => item.message).join(',');

    res.status(400).json({ error: message });
  } catch (error) {
    throw error;
  }
}

module.exports = middleware;
