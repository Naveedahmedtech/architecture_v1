const Joi = require("joi");

const schemas = {
  register: Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

module.exports = schemas;
