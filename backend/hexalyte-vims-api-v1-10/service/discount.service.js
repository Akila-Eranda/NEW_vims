const db = require('../models')
const Discount = db.discount 

// Get all Discounts
const getAllDiscounts = async () => {
    const discounts = Discount.findAll()
    return discounts
}

// Get Discount by ID
const getDiscountByID = async (id) => {
    const discounts = Discount.findAll({ where: { DiscountID: id } })
    return discounts
}

// Get all Purchase Order Discounts
const getDiscountsForPurchaseOrders = async () => {
    const discounts = Discount.findAll({ where: { PurchaseOrders: 1 } })
    return discounts
}

// Get all Sales Order Discounts
const getDiscountsForSalesOrders = async () => {
    const discounts = Discount.findAll({ where: { SalesOrders: 1 } })
    return discounts
}

// CREATE Discount
const createDiscount = async (body) => {
    const { Amount, SalesOrders, PurchaseOrders } = body
    const discount = Discount.create({ Amount, SalesOrders, PurchaseOrders, isActive: 1 })
    return discount
}

// UPDATE Discount

// DELETE Discount
const deleteDiscount = async (id) => {
    const discount = Discount.update({ isActive: 0 }, { where: { DiscountID: id } })
    return discount
}

module.exports = {
    getAllDiscounts,
    getDiscountByID,
    getDiscountsForPurchaseOrders,
    getDiscountsForSalesOrders,
    createDiscount,
    deleteDiscount
}