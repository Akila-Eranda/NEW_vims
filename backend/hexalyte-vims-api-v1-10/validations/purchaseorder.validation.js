const Joi = require('joi')

const getPurchaseOrder = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
};

const addNewPurchaseOrder = {
    body: Joi.object().keys({
        OrderDate: Joi.date().required(),
        TotalAmount: Joi.number().positive().required(),
        Status: Joi.string().required(),
        Discount: Joi.number().positive().required(),
        NetAmount: Joi.number().positive().required()
    })
}

const updatePurchaseOrder = {
    params: Joi.object().keys({
        id: Joi.required()
    }),
    body: Joi.object().keys({
        OrderDate: Joi.date().required(),
        TotalAmount: Joi.number().positive().required(),
        Status: Joi.string().required()
    })
}

const deletePurchaseOrder = {
    params: Joi.object().keys({
        id: Joi.required()
    })
}

module.exports = {
    getPurchaseOrder,
    addNewPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder
}