const express = require('express')
const router = express.Router()
const {auth} = require('../../middleware/auth')
const validate = require('../../middleware/validate')
const orderstatushistoryController = require('../../controller/orderstatushistory.controller')
const orderstatushistoryValidtion = require('../../validations/orderstatushistory.validation')

router
    .route('/')
    .get( auth(), orderstatushistoryController.getAllOrderStatusHistories)
    .post( auth(),orderstatushistoryController.addOrderStatusHistory)

router
    .route('/:id')
    .get( auth(),  orderstatushistoryController.getOrderStatusHistoryByID)
    .put( auth(), validate(orderstatushistoryValidtion.updateStatusHistory), orderstatushistoryController.updateOrderStatusHistoryByID)
    .delete( auth(), orderstatushistoryController.deleteOrderStatusHistoryByID)

module.exports = router