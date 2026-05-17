const Joi = require('joi');


const createSalesOrderDetail = {
  body: Joi.object().keys({
    OrderId: Joi.number().integer().required(),  
    ProductId: Joi.number().integer().required(), 
    Quantity: Joi.number().precision(2).min(0).required(),
    UnitPrice: Joi.number().precision(2).min(0).required(),
  }),
};


const getSalesOrderDetailByID = {
  params: Joi.object().keys({
    OrderId: Joi.number().integer().required(),
    ProductId: Joi.number().integer().required(),
  }),
};
const deleteSalesOrderDetail= {
  params: Joi.object().keys({
    OrderId: Joi.number().integer().required(),
    ProductId: Joi.number().integer().required(),
  }),
};

const updateSalesOrderDetail = {
  params: Joi.object().keys({
    OrderId: Joi.number().integer().required(),
    ProductId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    Quantity: Joi.number().precision(2).min(0),  
    UnitPrice: Joi.number().precision(2).min(0),    
  }).min(1),  
};



module.exports = {
  createSalesOrderDetail,
  getSalesOrderDetailByID,
  updateSalesOrderDetail,
  deleteSalesOrderDetail,
}