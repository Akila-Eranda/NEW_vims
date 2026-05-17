const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const Salesorderservices = require("../service/salesorder.service");
const { salesorder } = require("../models");

const createsalesorder = catchAsync(async (req, res) => {
    const newsalesorder = await Salesorderservices.createsalesorder(req.body);

    if (newsalesorder.Status === "success") {
        res.status(httpStatus.CREATED).send({
            status: "success",
            message: "Sales order created successfully",
            newsalesorder: newsalesorder
        });
    } else {
        res.status(httpStatus.CONFLICT).send({
            status: "failure",
            message: newsalesorder
        });
    }
});

const getallsalesorder = catchAsync(async (req, res) => {
    const salesorders = await Salesorderservices.getallsalesorder();
//     if(salesorders.length==0){
//         res.status(httpStatus.NOT_FOUND).send({
//             message:"no sales orders found"
//         })
//     }
//    return res.status(httpStatus.OK).send({
//         status: "success",
//         message: "Sales orders retrieved successfully",
//         salesorders
//     });
    res.send({salesorders})
});

const getsalesorderbyID = catchAsync(async (req, res) => {
    const salesorder = await Salesorderservices.getsalesorderBYId(req.params.id);
    if (salesorder) {
        res.status(httpStatus.OK).send({
            status: "success",
            message: "Sales order retrieved successfully",
            salesorder
        });
    } else {
        res.status(httpStatus.NOT_FOUND).send({
            status: "failure",
            message: "Sales order not found",
        });
    }
});

const updateSalesorderPaymentStatus = catchAsync(async (req, res) => {
    const [affectedRows] = await Salesorderservices.updatesalesorderPayementStatusById(req.params.id, req.body);
    if (affectedRows === 0) {
        res.status(httpStatus.NOT_FOUND).send({
            status: "failure",
            message: "Sales order not found",
        });
        return;
    }

    const updatedSalesOrder = await Salesorderservices.getsalesorderBYId(req.params.id);
    res.status(httpStatus.OK).send({
        status: "success",
        message: "Sales order updated successfully",
        salesorder: updatedSalesOrder
    });
});

const updateSalesorder = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const updatedSalesorder = await Salesorderservices.updateSalesorderById(orderId, req.body);

  if (updatedSalesorder.Status === "success") {
    res.status(httpStatus.OK).send({
      status: "success",
      message: "Sales order updated successfully",
      updatedSalesorder: updatedSalesorder
    });
  } else {
    res.status(httpStatus.CONFLICT).send({
      status: "failure",
      message: updatedSalesorder.Status
    });
  }
});


const deletesalesorder = catchAsync(async (req, res) => {
    const deletedSalesOrder = await Salesorderservices.deletesalesorderById(req.params.id);
    if(deletedSalesOrder == 0){
        return res.status(httpStatus.BAD_REQUEST).send({
            message: `Invalid Sales Order Id. Sales Order Does Not exists`
        })
    }

    return res.status(httpStatus.OK).send({deletedSalesOrder});
});

const getsalesreport = catchAsync(async (req, res)=>{
   const { startDate, endDate } = req.query;
    console.log('Sales Report Request - startDate:', startDate, 'endDate:', endDate);
    const report = await Salesorderservices.getSalesReport({startDate,endDate});
    
    // Return 200 even if no data found (empty arrays instead of 404)
    if(!report || report.results.length === 0){
        res.status(httpStatus.OK).send({
            status: "success",
            message: "No sales data found for the selected date range",
            productSalesData: [],
            orders: [],
            totalDiscounts: 0
        });
        return;
    }
    res.status(httpStatus.OK).send({
        status: "success",
        message: "Sales report generated successfully",
        productSalesData: report.results,
        orders: report.orders || [],
        totalDiscounts: report.discounts
    })
});

const getPaymentStatsummery = catchAsync(async (req,res)=>{
    const paymentsummery = await Salesorderservices.getPaymentStatusSummary();
    if(paymentsummery.length==0){
        res.status(httpStatus.NOT_FOUND).send({
            message:"no sales orders found"
        })
    }

     return res.status(httpStatus.OK).send({
        status: "success",
        message: "Sales orders retrieved successfully",
        paymentsummery,
    });
})

/**
 * Get Monthly Sales Trends
 * Query param: year (optional, defaults to current year)
 */
const getMonthlySalesTrends = catchAsync(async (req, res) => {
    const year = req.query.year || new Date().getFullYear();

    const trends = await Salesorderservices.getMonthlySalesTrends(year);

    return res.status(httpStatus.OK).send({
        status: "success",
        message: `Monthly sales trends for ${year}`,
        year: parseInt(year),
        monthlyData: trends
    });
});

/**
 * Get Sales by Customer Report
 * Query params: startDate, endDate (YYYY-MM-DD)
 */
const getSalesByCustomerReport = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: 'startDate and endDate query parameters are required'
        });
    }

    const report = await Salesorderservices.getSalesByCustomerReport({ startDate, endDate });

    return res.status(httpStatus.OK).send({
        status: "success",
        message: "Sales by customer report generated successfully",
        customerData: report
    });
});

/**
 * Get Unpaid Orders Report
 * Query params: startDate, endDate (YYYY-MM-DD)
 * Returns all unpaid sales orders within the specified date range
 */
const getUnpaidOrdersReport = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: 'startDate and endDate query parameters are required'
        });
    }

    const unpaidOrders = await Salesorderservices.getUnpaidOrdersByDateRange({ startDate, endDate });

    return res.status(httpStatus.OK).send({
        status: "success",
        message: "Unpaid orders report generated successfully",
        count: unpaidOrders.length,
        unpaidOrders: unpaidOrders
    });
});

// Bulk update payment status for multiple orders
const bulkMarkAsPaid = catchAsync(async (req, res) => {
    const { orderIds, paymentStatus = 'PAID' } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: "failure",
            message: "orderIds array is required"
        });
    }

    const result = await Salesorderservices.bulkUpdatePaymentStatus(orderIds, paymentStatus);

    res.status(httpStatus.OK).send({
        status: "success",
        message: result.message,
        updatedCount: result.updatedCount
    });
});

/**
 * Get Customer Outstanding Balance
 * Returns the total unpaid amount for the specified customer
 */
const getCustomerOutstandingBalance = catchAsync(async (req, res) => {
    const { customerId } = req.params;

    if (!customerId) {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: "failure",
            message: "customerId parameter is required"
        });
    }

    const result = await Salesorderservices.getCustomerOutstandingBalance(customerId);

    if (!result.success) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            status: "failure",
            message: "Failed to fetch outstanding balance",
            error: result.error
        });
    }

    return res.status(httpStatus.OK).send({
        status: "success",
        message: "Customer outstanding balance retrieved successfully",
        customerId: result.customerId,
        outstandingBalance: result.outstandingBalance,
        unpaidOrderCount: result.unpaidOrderCount,
        unpaidOrders: result.unpaidOrders
    });
});

module.exports = {
    createsalesorder,
    getallsalesorder,
    getsalesorderbyID,
    updateSalesorder,
    deletesalesorder,
    getsalesreport,
    getPaymentStatsummery,
    updateSalesorderPaymentStatus,
    bulkMarkAsPaid,
    // Additional report functions
    getMonthlySalesTrends,
    getSalesByCustomerReport,
    getUnpaidOrdersReport,
    // Customer outstanding balance
    getCustomerOutstandingBalance
};
