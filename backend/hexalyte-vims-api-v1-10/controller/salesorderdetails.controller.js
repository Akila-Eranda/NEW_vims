const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const SalesorderdetailsServices = require("../service/salesorderdetails.service");

const createSalesOrderDetails = catchAsync(async (req, res) => {
    const newOrderDetail = await SalesorderdetailsServices.createorderdetails(req.body);

    if (newOrderDetail) {
        res.status(httpStatus.CREATED).send({
            status: "success",
            message: "Sales order detail created successfully",
            data: newOrderDetail
        });
    } else {
        res.status(httpStatus.CONFLICT).send({
            status: "failure",
            message: "Sales order detail already exists",
        });
    }
});

const getAllSalesOrderDetails = catchAsync(async (req, res) => {
    const orderDetails = await SalesorderdetailsServices.getallorderdetails();
    res.status(httpStatus.OK).send({
        status: "success",
        message: "Sales order details retrieved successfully",
        data: orderDetails
    });
});

const getSalesOrderDetailsByOrderID = catchAsync(async (req, res) => {
    const {OrderId} = req.params;

    const salesOrderDetails = await SalesorderdetailsServices.getSalesOrderDetailsByOrderID(OrderId)

    if(salesOrderDetails.status === "success"){
        return res.status(httpStatus.OK).send({
            message: "Sales order details retreived successfully",
            data: salesOrderDetails.data
        })
    } else {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: "No sales orders found"
        })
    }

    // return res.send({salesOrderDetails})

})

const getSalesOrderDetailsByID = catchAsync(async (req, res) => {
    const { OrderId, ProductId } = req.params;
    const orderDetail = await SalesorderdetailsServices.getorderdetailsBYId(OrderId, ProductId);
    if (orderDetail) {
        res.status(httpStatus.OK).send({
            status: "success",
            message: "Sales order detail retrieved successfully",
            data: orderDetail
        });
    } else {
        res.status(httpStatus.NOT_FOUND).send({
            status: "failure",
            message: "Sales order detail not found",
        });
    }
});

const updateSalesOrderDetails = catchAsync(async (req, res) => {
    const { OrderId, ProductId } = req.params;
    const affectedRows = await SalesorderdetailsServices.updateorderdetailsById(OrderId, ProductId, req.body);
    if (affectedRows === 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            status: "failure",
            message: "Sales order detail not found",
        });
    }
    const updatedOrderDetail = await SalesorderdetailsServices.getorderdetailsBYId(OrderId, ProductId);
    res.status(httpStatus.OK).send({
        status: "success",
        message: "Sales order detail updated successfully",
        data: updatedOrderDetail
    });
});

const deleteSalesOrderDetails = catchAsync(async (req, res) => {
    const { OrderId, ProductId } = req.params; 
    const deleted = await SalesorderdetailsServices.deleteorderdetailsById(OrderId, ProductId);
    
    if (!deleted) {
        return res.status(httpStatus.NOT_FOUND).send({
            status: "failure",
            message: "Sales order detail not found",
        });
    }
    
    res.status(httpStatus.OK).send({
        status: "success",
        message: "Sales order detail deleted successfully",
    });
});

module.exports = {
    createSalesOrderDetails,
    getAllSalesOrderDetails,
    getSalesOrderDetailsByID,
    getSalesOrderDetailsByOrderID,
    updateSalesOrderDetails,
    deleteSalesOrderDetails
};