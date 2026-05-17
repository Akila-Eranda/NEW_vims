const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const returnOrderServices = require('../service/returnorders.service')

const getAllReturnOrders = catchAsync(async (req, res) => {

    const allReturnOrders = await returnOrderServices.getAllReturnOrders()

    return res.send({ allReturnOrders })

})

const createReturnSalesOrder = catchAsync(async (req, res) => {

    // const newReturnSalesOrder = await returnOrderServices.createReturnSalesOrder(req.body)
    const orderId = req.params.id;
    const updatedSalesorder = await returnOrderServices.createReturnSalesOrder(orderId, req.body);
    return res.send({ updatedSalesorder })

})

// ==================== NEW CONTROLLERS ====================

/**
 * Get Return Order by ID
 */
const getReturnOrderById = catchAsync(async (req, res) => {
    const result = await returnOrderServices.getReturnOrderById(req.params.id);

    if (result.status === 'error') {
        return res.status(httpStatus.NOT_FOUND).send({
            status: 'fail',
            message: result.message
        });
    }

    return res.status(httpStatus.OK).send({
        status: 'success',
        message: 'Return order retrieved successfully',
        returnOrder: result.data
    });
});

/**
 * Delete Return Order by ID
 */
const deleteReturnOrder = catchAsync(async (req, res) => {
    const result = await returnOrderServices.deleteReturnOrder(req.params.id);

    if (result.status === 'error') {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: result.message
        });
    }

    return res.status(httpStatus.OK).send({
        status: 'success',
        message: result.message
    });
});

/**
 * Get Return Orders by Date Range
 * Query params: startDate, endDate (YYYY-MM-DD)
 */
const getReturnOrdersByDateRange = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: 'startDate and endDate query parameters are required'
        });
    }

    const result = await returnOrderServices.getReturnOrdersByDateRange({ startDate, endDate });

    if (result.status === 'error') {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: result.message
        });
    }

    return res.status(httpStatus.OK).send({
        status: 'success',
        message: 'Return orders retrieved successfully',
        returnOrders: result.data
    });
});

/**
 * Get Return Order Report
 * Query params: startDate, endDate (YYYY-MM-DD)
 */
const getReturnOrderReport = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: 'startDate and endDate query parameters are required'
        });
    }

    const result = await returnOrderServices.getReturnOrderReport({ startDate, endDate });

    if (result.status === 'error') {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: result.message
        });
    }

    return res.status(httpStatus.OK).send({
        status: 'success',
        message: 'Return order report generated successfully',
        report: result.data
    });
});

/**
 * Get Return Orders by Sales Order ID
 */
const getReturnsBySalesOrderId = catchAsync(async (req, res) => {
    const result = await returnOrderServices.getReturnsBySalesOrderId(req.params.salesOrderId);

    if (result.status === 'error') {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: result.message
        });
    }

    return res.status(httpStatus.OK).send({
        status: 'success',
        message: 'Returns for sales order retrieved successfully',
        returns: result.data
    });
});

module.exports = { 
    createReturnSalesOrder, 
    getAllReturnOrders,
    getReturnOrderById,
    deleteReturnOrder,
    getReturnOrdersByDateRange,
    getReturnOrderReport,
    getReturnsBySalesOrderId
}