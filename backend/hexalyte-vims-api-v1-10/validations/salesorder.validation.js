const joi = require('joi');

const createsalesorder = {
  body: joi.object().keys({
    // CustomerName: joi.string().required().max(100),
    CustomerID: joi.number().integer().required(),
    OrderDate: joi.date().required(),
    TotalAmount: joi.number().precision(2).required().min(0),
    Status: joi.string().required(),
    Discount: joi.number().precision(2).min(0),
    LocationID: joi.number().integer().required(),
    DiscountID: joi.number().integer().allow(null),
    PaymentStatus: joi.string().required(),
    TransactionType: joi.string().required(),
    OrderItems: joi.array().items(
      joi.object({
        ProductID: joi.number().integer().required(),
        Quantity: joi.number().precision(2).min(0).required(),
        UnitPrice: joi.number().precision(2).min(0).required(),
        ProductName: joi.string(),
        TotalPrice: joi.number()
      })
    )
  }),
};


const getsalesorderbyID = {
  params: joi.object().keys({
    id: joi.number().integer().required()
    }),

};

const updatesalesorder = {
  params: joi.object().keys({
    id: joi.number().integer().required()
  }),
  body: joi.object().keys({
    CustomerID: joi.number().integer().required(),
    OrderDate: joi.date().required(),
    TotalAmount: joi.number().precision(2).required().min(0),
    Status: joi.string().valid().required(),
    Discount: joi.number().precision(2).min(0),
    LocationID: joi.number().integer().required(),
    DiscountID: joi.number().integer().allow(null),
    PaymentStatus: joi.string().required(),
    TransactionType: joi.string().required(),
    OrderItems: joi.array().items(
      joi.object({
        ProductID: joi.number().integer().required(),
        Quantity: joi.number().precision(2).min(0).required(),
        UnitPrice: joi.number().precision(2).min(0).required(),
        ProductName: joi.string(),
        TotalPrice: joi.number()
      })
    ).min(1).required()
  }),
};

const deletesalesorder = {
  params: joi.object().keys({
    id: joi.number().integer().required()
  }),
};

module.exports = {
  createsalesorder,
  getsalesorderbyID,
  updatesalesorder,
  deletesalesorder,
};
