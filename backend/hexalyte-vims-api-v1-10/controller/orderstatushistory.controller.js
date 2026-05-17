const httpStatus = require('http-status')
const db = require('../models')
const orderstatushistory = db.orderstatushistory
const orderstatushistoryService = require('../service/orderstatushistory.service')
const catchAsync = require('../utils/catchAsync')

const getAllOrderStatusHistories = catchAsync(async (req, res) => {

    const orderstatushistories = await orderstatushistory.findAll()
    if (orderstatushistories.length == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: 'No Order Status Histories found'
        })
    }
    return res.status(httpStatus.OK).send({ orderstatushistories })

})

const getOrderStatusHistoryByID = catchAsync(async (req, res) => {

    const orderstatushistory = await orderstatushistoryService.getOrderStatusHistoryByID(req.params.id)
    if (orderstatushistory == null) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: 'No Order Status History found'
        })
    }
    return res.status(httpStatus.OK).send({ orderstatushistory })

})

const addOrderStatusHistory = catchAsync(async (req, res) => {

    const newOrderStatusHistory = await orderstatushistoryService.addOrderStatusHistory(req.body)
    return res.status(httpStatus.OK).send({ newOrderStatusHistory })

})

const updateOrderStatusHistoryByID = catchAsync(async (req, res) => {

    const updatedOrderStatusHistory = await orderstatushistoryService.updateOrderStatusHistoryByID(req.params.id, req.body)
    return res.status(httpStatus.OK).send({ updatedOrderStatusHistory })

})

const deleteOrderStatusHistoryByID = catchAsync(async (req, res) => {

    const deletedOrderStatusHistory = await orderstatushistoryService.deleteOrderStatusHistoryByID(req.params.id)
    return res.status(httpStatus.OK).send({ deletedOrderStatusHistory })

})

module.exports = {

    getAllOrderStatusHistories,
    getOrderStatusHistoryByID,
    addOrderStatusHistory,
    updateOrderStatusHistoryByID,
    deleteOrderStatusHistoryByID

}