const Joi = require('joi')

const addOrderStatusHistory = {
    body: Joi.object().keys({
        OldStatus: Joi.string(),
        NewStatus: Joi.string().required(),
        StatusChangeDate: Joi.date().required(),
        purchaseorderOrderID: Joi.number().integer(),
        salesorderOrderID: Joi.number().integer()
    }).xor('purchaseorderOrderID', 'salesorderOrderID')
}

const updateStatusHistory = {
    params: Joi.object().keys({
        id: Joi.number().integer()
    }),
    body: Joi.object().keys({
        OldStatus: Joi.string().required(),
        NewStatus: Joi.string().required(),
        StatusChangeDate: Joi.date().required(),
        purchaseorderOrderID: Joi.number().integer(),
        salesorderOrderID: Joi.number().integer()
    })
}

module.exports = {
    addOrderStatusHistory,
    updateStatusHistory
}