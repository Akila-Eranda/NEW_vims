const db = require('../models')
const PurchaseOrder = db.purchaseorder
const purchaseorderServices = require('../service/purchaseorder.service')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')

const addNewPurchaseOrder = catchAsync(async (req, res) => {
    const purchaseOrder = await purchaseorderServices.addNewPurchaseOrder(req.body)
    if (purchaseOrder) {
        return res.status(httpStatus.OK).send({ purchaseOrder })
    }

})

const getAllPurchaseOrders = catchAsync(async (req, res) => {
    const purchaseOrders = await PurchaseOrder.findAll();

    if (purchaseOrders.length == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: "No Purchase Orders found"
        })
    }

    return res.status(httpStatus.OK).send({ purchaseOrders })
})

const getPurchaseOrderByID = catchAsync(async (req, res) => {
    const PurchaseOrder = await purchaseorderServices.getPurchaseOrderByID(req.params.id)

    if (!PurchaseOrder) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: "No Purchase Order Exists"
        })
    }

    return res.status(httpStatus.OK).send({ PurchaseOrder })
})

const updatePurchaseOrderByID = catchAsync(async (req, res) => {
    const PurchaseOrder = await purchaseorderServices.updatePurchaseOrderByID(req.params.id, req.body)
    return res.status(httpStatus.OK).send({ PurchaseOrder })
})

const deletePurchaseOrderByID = catchAsync(async (req, res) => {

    const PurchaseOrder = await purchaseorderServices.deletePurchaseOrderByID(req.params.id)

    if (PurchaseOrder == 1) {
        return res.status(httpStatus.OK).send({
            status: 'success',
            message: 'Purchase Order Deleted successfully'
        })
    } else if (PurchaseOrder == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            status: 'fail',
            message: 'No Purchase Order Found'
        })
    } else {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: PurchaseOrder
        })
    }

})

// ==================== REPORT CONTROLLERS ====================

/**
 * Get Purchase Order Report by Date Range
 * Query params: startDate, endDate (YYYY-MM-DD)
 */
const getPurchaseOrderReport = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: 'startDate and endDate query parameters are required'
        });
    }

    const report = await purchaseorderServices.getPurchaseOrderReport({ startDate, endDate });

    if (!report || report.orders.length === 0) {
        return res.status(httpStatus.OK).send({
            status: 'success',
            message: 'No purchase order data found for the selected date range',
            productData: [],
            orders: [],
            summary: { TotalOrders: 0, GrossTotal: 0, TotalDiscounts: 0, NetTotal: 0 }
        });
    }

    return res.status(httpStatus.OK).send({
        status: 'success',
        message: 'Purchase order report generated successfully',
        productData: report.productData,
        orders: report.orders,
        summary: report.summary
    });
});

/**
 * Get Purchase Order Status Summary
 * Returns count and totals grouped by status
 */
const getPurchaseOrderStatusSummary = catchAsync(async (req, res) => {
    const summary = await purchaseorderServices.getPurchaseOrderStatusSummary();

    if (!summary || summary.length === 0) {
        return res.status(httpStatus.OK).send({
            status: 'success',
            message: 'No purchase orders found',
            statusSummary: []
        });
    }

    return res.status(httpStatus.OK).send({
        status: 'success',
        message: 'Purchase order status summary retrieved successfully',
        statusSummary: summary
    });
});

/**
 * Get Monthly Purchase Trends
 * Query param: year (optional, defaults to current year)
 */
const getMonthlyPurchaseTrends = catchAsync(async (req, res) => {
    const year = req.query.year || new Date().getFullYear();

    const trends = await purchaseorderServices.getMonthlyPurchaseTrends(year);

    return res.status(httpStatus.OK).send({
        status: 'success',
        message: `Monthly purchase trends for ${year}`,
        year: parseInt(year),
        monthlyData: trends
    });
});

module.exports = {
    getAllPurchaseOrders,
    addNewPurchaseOrder,
    getPurchaseOrderByID,
    updatePurchaseOrderByID,
    deletePurchaseOrderByID,
    // Report functions
    getPurchaseOrderReport,
    getPurchaseOrderStatusSummary,
    getMonthlyPurchaseTrends
}