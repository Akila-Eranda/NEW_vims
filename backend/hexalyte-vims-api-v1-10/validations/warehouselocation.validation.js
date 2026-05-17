const joi = require('joi');

const createwarehouselocation = {
  body: joi.object().keys({
    WarehouseName: joi.string().max(100).required(),
    Address: joi.string().max(255).allow(null, '').optional()
  }),
};

const getwarehouselocationbyID = {
  params: joi.object().keys({
    id: joi.number().integer().required()
  }),
};

const updatewarehouselocation = {
  params: joi.object().keys({
    id: joi.number().integer().required()
  }),
  body: joi.object().keys({
    WarehouseName: joi.string().max(100).required(),
    Address: joi.string().max(255).allow(null, '').optional()
  }),
};

const deletewarehouselocation = {
  params: joi.object().keys({
    id: joi.number().integer().required()
  }),
};

module.exports = {
  createwarehouselocation,
  getwarehouselocationbyID, 
  updatewarehouselocation,
  deletewarehouselocation
};
