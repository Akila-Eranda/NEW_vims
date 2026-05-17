const joi = require('joi');

const addPurchaseorderDetails = {
    body: joi.object().keys({
        OrderID: joi.number().integer().required(),
        ProductID: joi.number().integer().required(),
        Quantity: joi.number().integer().required(),
        UnitPrice: joi.number().integer().required(),
    })
}

const getPurchaseOrderDetails = {
    params: joi.object().keys({
        id: joi.number().integer().required(),
    })
}

const deletePurchaseOrderDetailsByOrderID = {
    params: joi.object().keys({
        id: joi.number().integer().required(),
    })
}

const updatePurchaseOrderDetails = {
    params: joi.object().keys({
        id: joi.number().integer().required(),
        pid: joi.number().integer().required(),
    }),
    body: joi.object().keys({
       Quantity: joi.number().integer().required(),
       UnitPrice: joi.number().integer().required(),
    })
}

const deletePurchaseOrderDetails = {
    params: joi.object().keys({
        id: joi.number().integer().required(),
        pid: joi.number().integer().required()
    })
}

module.exports = {
    addPurchaseorderDetails,
    getPurchaseOrderDetails,
    deletePurchaseOrderDetailsByOrderID,
    updatePurchaseOrderDetails,
    deletePurchaseOrderDetails,
}