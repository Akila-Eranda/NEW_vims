const db = require('../models')
const httpStatus = require("http-status");
const discountService = require('../service/discount.service')
const catchAsync = require("../utils/catchAsync");

// GET all Discounts
const getAllDiscounts = catchAsync(async (req, res) => {
    const allDiscounts = await discountService.getAllDiscounts()
    return res.send({allDiscounts})
})

// GET discounts by ID
const getDiscountsByID = catchAsync(async (req, res) => {
    const discountsByID = await discountService.getDiscountByID(req.params.id)
    return res.send({discountsByID})
})

// GET discounts for Purchase Orders
const getDiscountsForPurchaseOrders = catchAsync(async (req, res) => {
    const discounts = await discountService.getDiscountsForPurchaseOrders()
    return res.send({discounts})
})

// GET discounts for Sales Orders
const getDiscountsForSalesOrders = catchAsync(async (req, res) => {
    const discounts = await discountService.getDiscountsForSalesOrders()
    return res.send({discounts})
})

// CREATE discount
const createDiscount = catchAsync(async (req, res) => {
    const newDiscount = await discountService.createDiscount(req.body)
    return res.send({newDiscount})
})

// DELETE discount
const deleteDiscount = catchAsync(async (req, res) => {
    const discount = await discountService.deleteDiscount(req.params.id)
    return res.send({discount})
})

module.exports = {
    getAllDiscounts,
    getDiscountsByID,
    getDiscountsForPurchaseOrders,
    getDiscountsForSalesOrders,
    createDiscount,
    deleteDiscount
}