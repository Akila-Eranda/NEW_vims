const db = require('../models');
const Purchaseorderdetail = db.purchaseorderdetail;
const PurchaseorderdetailServices = require('../service/purchaseorderdetail.service')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')


const getPurchaseOrderDetails = catchAsync(async (req, res) => {

    const purchaseOrderDetails = await PurchaseorderdetailServices.getPurchaseOrderDetailsByOrderID(req.params.id)
    res.status(httpStatus.OK).send({ purchaseOrderDetails });

})

const addPurchaseOrderDetails = catchAsync(async(req, res) => {

    const addedPurchaseOrderDetails = await PurchaseorderdetailServices.addPurchaseOrderDetails(req.body)
    res.status(httpStatus.OK).send({addedPurchaseOrderDetails})

})

const updatePurchaseOrderDetail = catchAsync(async(req, res) => {

    const updatedPurchaseOrderDetail = await PurchaseorderdetailServices.updatePurchaseOrderDetails(req.params, req.body)
    res.status(httpStatus.OK).send({updatedPurchaseOrderDetail})

})

const deletePurchaseOrderDetail = catchAsync(async(req, res) => {

    const deletedPurchaseOrderDetail = await PurchaseorderdetailServices.deletePurchaseOrderDetail(req.params)
    res.status(httpStatus.OK).send({deletedPurchaseOrderDetail})

})

const deletePurchaseOrderDetailsByOrderID = catchAsync(async(req, res) => {

    const deletedPurchaseOrderDetails = await PurchaseorderdetailServices.deletePurchaseOrderDetailsByOrderID(req.params.id)
    res.status(httpStatus.OK).send({deletedPurchaseOrderDetails})

})

module.exports = {
    getPurchaseOrderDetails,
    addPurchaseOrderDetails,
    updatePurchaseOrderDetail,
    deletePurchaseOrderDetail,
    deletePurchaseOrderDetailsByOrderID
}