const express = require('express');
const router = express.Router();
const returnOrderController = require('../../controller/returnorder.controller');
const { auth } = require('../../middleware/auth');

// ==================== REPORT ROUTES ====================
// Must be defined BEFORE :id routes to avoid conflicts

router
    .route('/report')
    .get(auth(), returnOrderController.getReturnOrderReport);

router
    .route('/by-date')
    .get(auth(), returnOrderController.getReturnOrdersByDateRange);

// ==================== SALES ORDER RETURNS ====================

router
    .route('/salesorder')
    .get(auth(), returnOrderController.getAllReturnOrders)
    .post(auth(), returnOrderController.createReturnSalesOrder);

router
    .route('/salesorder/:id')
    .put(auth(), returnOrderController.createReturnSalesOrder);

router
    .route('/for-salesorder/:salesOrderId')
    .get(auth(), returnOrderController.getReturnsBySalesOrderId);

// ==================== INDIVIDUAL RETURN OPERATIONS ====================

router
    .route('/:id')
    .get(auth(), returnOrderController.getReturnOrderById)
    .delete(auth(), returnOrderController.deleteReturnOrder);


module.exports = router