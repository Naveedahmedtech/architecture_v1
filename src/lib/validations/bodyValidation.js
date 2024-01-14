const Joi = require("joi");
const { VALID_ROLES } = require("../../constants/validation");


const schemas = {
  register: Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(...VALID_ROLES).optional(),
  }),
};

module.exports = schemas;
