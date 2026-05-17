const joi = require('joi');

const createProduct = {
  body: joi.object().keys({
    Name: joi.string().required().max(100),
    Description: joi.string().required(),
    BuyingPrice: joi.number().precision(2).required().min(0),
    SellingPrice: joi.number().precision(2).required().min(0),
    QuantityInStock: joi.required(),
    SupplierID: joi.number().integer().required(),
    CategoryID: joi.number().integer().required(),
  }),
};

const getProducts = {
  query: joi.object().keys({
    CategoryID: joi.number().integer().optional(),
  }),
};

const getProductById = {
  params: joi.object().keys({
    id: joi.number().integer().required()
  }),
};

const updateProduct = {
  params: joi.object().keys({
    id: joi.number().integer().required()
  }),
  body: joi.object().keys({
    Name: joi.string().required().max(100),
    Description: joi.string().required(),
    BuyingPrice: joi.number().precision(2).required().min(0),
    SellingPrice: joi.number().precision(2).required().min(0),
    QuantityInStock: joi.number().required(),
    SupplierID: joi.number().integer().required(),
    CategoryID: joi.number().integer().required(),
  }),
};

const deleteProduct = {
  params: joi.object().keys({
    id: joi.number().integer().required()
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
