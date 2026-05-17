const Joi = require('joi');

const createSupplier = {
  body: Joi.object().keys({
    Name: Joi.string().max(255).required(),
    CompanyName: Joi.string().max(100).allow(null, ''),
    ContactTitle: Joi.string().max(100).allow(null, ''),
    Phone: Joi.string().max(20).allow(null, ''),
    Email: Joi.string().email().max(100).allow(null, ''),
    Address: Joi.string().max(255).allow(null, ''),
  }),
};



const getSupplierByID = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const updateSupplier = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    Name: Joi.string().max(255).required(),
    CompanyName: Joi.string().max(100).allow(null, ''),
    ContactTitle: Joi.string().max(100).allow(null, ''),
    Phone: Joi.string().max(20).allow(null, ''),
    Email: Joi.string().email().max(100).allow(null, ''),
    Address: Joi.string().max(255).allow(null, ''),
  }),
};

const deleteSupplier = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

module.exports = {
  createSupplier,
  getSupplierByID,
  updateSupplier,
  deleteSupplier,
};
