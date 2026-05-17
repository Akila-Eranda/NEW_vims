const Joi = require('joi')

const addNewProductStorage = {
    body: Joi.object().keys({
        ProductID: Joi.number().integer().required(),
        LocationID: Joi.number().integer().required(),
        Quantity: Joi.number().required(),
        LastUpdated: Joi.date().required()
    })
}

const updateProductStorage = {
    body: Joi.object().keys({
        Quantity: Joi.number().required(),
        LastUpdated: Joi.date().required()
    })
}

module.exports = {
    addNewProductStorage,
    updateProductStorage
}