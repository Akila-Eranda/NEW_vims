const Joi = require("joi");

const addTransaction = {
  body: Joi.object().keys({
    SalesOrderID: Joi.number(),
    PurchaseOrderID: Joi.number(),
    ProductID: Joi.number().required(),
    Quantity: Joi.number().required(),
    TransactionDate: Joi.date().required(),
    TransactionType: Joi.string().max(20),
  }),
};

const getTransactionById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
};

const updateTransactionById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
  body: Joi.object().keys({
    SalesOrderID: Joi.number(),
    PurchaseOrderID: Joi.number(),
    ProductID: Joi.number(),
    Quantity: Joi.number(),
    TransactionDate: Joi.date(),
    TransactionType: Joi.string().max(20),
  }),
};

const deleteTransactionById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
};

module.exports = {
  addTransaction,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
};
