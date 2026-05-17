const Joi = require("joi");

const addCategory = {
  body: Joi.object().keys({
    Name: Joi.string().required(),
    Description: Joi.required(),
  }),
};

const getCategoryById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
};

const updateCategoryById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
  body: Joi.object().keys({
    Name: Joi.string().required(),
    Description: Joi.string().required(),
  }),
};

const deleteCategoryById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
};

module.exports = {
  addCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
};
