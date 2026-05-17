const Joi = require("joi");

const addCustomerAddress = {
  body: Joi.object().keys({
    AddressType: Joi.string().max(20).required(),
    Street: Joi.string().max(255).required(),
    City: Joi.string().max(100).required(),
    State: Joi.string().max(100),
    PostalCode: Joi.string().max(20),
    Country: Joi.string().max(50),
    IsDefault: Joi.number().max(1).required(),
  }),
};

const getCustomerAddressById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
};

const updateCustomerAddressById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
  body: Joi.object().keys({
    AddressType: Joi.string().max(20).required(),
    Street: Joi.string().max(255).required(),
    City: Joi.string().max(100).required(),
    State: Joi.string().max(100),
    PostalCode: Joi.string().max(20),
    Country: Joi.string().max(50),
    IsDefault: Joi.number().max(1).required(),
  }),
};

const deleteCustomerAddressById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
};

module.exports = {
  addCustomerAddress,
  getCustomerAddressById,
  updateCustomerAddressById,
  deleteCustomerAddressById,
};
