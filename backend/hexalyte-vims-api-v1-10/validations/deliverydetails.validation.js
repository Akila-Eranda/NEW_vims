const Joi = require("joi");

const addDeliveryDetails = {
  body: Joi.object().keys({
    CustomerID: Joi.number().integer().required(),
    DeliveryAddressID: Joi.number().integer().required(),
    OrderID: Joi.number().integer().required(),
    DeliveryDate: Joi.date().required(),
    DeliveryTimeSlot: Joi.string().required(),
    DeliveryStatus: Joi.string().required(),
    TrackingNumber: Joi.string().max(100).required(),
    Carrier: Joi.string().max(100).required(),
    EstimatedDeliveryDate: Joi.date().required(),
    ActualDeliveryDate: Joi.date().required(),
    PaymentStatus: Joi.string()
  }),
};

const getDeliveryDetailsById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
};


const updateDeliveryDetailById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
  body: Joi.object().keys({
    CustomerID: Joi.number().required(),
    DeliveryAddressID: Joi.number().required(),
    OrderID: Joi.number().required(),
    DeliveryDate: Joi.date().required(),
    DeliveryTimeSlot: Joi.string().required(),
    DeliveryStatus: Joi.string().required(),
    TrackingNumber: Joi.string().max(100).required(),
    Carrier: Joi.string().max(100).required(),
    EstimatedDeliveryDate: Joi.date().required(),
    ActualDeliveryDate: Joi.date().required(),
    PaymentStatus: Joi.string()
  }),
};

const deleteDeliveryDetailsById = {
  params: Joi.object().keys({
    id: Joi.required(),
  }),
};

module.exports = {
  addDeliveryDetails,
  getDeliveryDetailsById,
  updateDeliveryDetailById,
  deleteDeliveryDetailsById,
};
