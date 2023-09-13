const Joi = require("@hapi/joi");

const urlSchema = Joi.object({
  url: Joi.string().trim().required(),
});

module.exports = { urlSchema };
