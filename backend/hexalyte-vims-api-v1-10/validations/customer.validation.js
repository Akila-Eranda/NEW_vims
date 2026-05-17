const Joi = require("joi");

const addCustomer = {
  body: Joi.object().keys({
    Name: Joi.string().required(),
    CompanyName: Joi.string().required(),
    Phone: Joi.number().required(),
    Email: Joi.string().email(),
    CustomerAddressID: Joi.number(),
    Note: Joi.string()
  }),
};

const getCustomerById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
};

const updateCustomerById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
  body: Joi.object().keys({
    Name: Joi.string().required(),
    CompanyName: Joi.string().required(),
    Phone: Joi.number().required(),
    Email: Joi.string().email(),
    CustomerAddressID: Joi.number(),
    Note: Joi.string()
  }),
};

const deleteCustomerById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
};

module.exports = {
  addCustomer,
  getCustomerById,
  deleteCustomerById,
  updateCustomerById,
};
