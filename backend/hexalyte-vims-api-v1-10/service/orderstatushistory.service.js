const db = require('../models')
const orderstatushistory = db.orderstatushistory
const purchaseorder = db.purchaseorder
const salesorder = db.salesorder

const getOrderStatusHistoryByID = async (orderstatushistoryID) => {

    const orderstatushistoryRow = await orderstatushistory.findByPk(orderstatushistoryID)
    return orderstatushistoryRow

}

const addOrderStatusHistory = async (params) => {

    const { OldStatus, NewStatus, StatusChangeDate, purchaseorderOrderID, salesorderOrderID } = params

    const purchaseOrder = purchaseorder.findByPk(purchaseorderOrderID)
    if (purchaseOrder == null){
        return `No Purchase Order found with POID: ${purchaseorderOrderID}`
    }

    const salesOrder = salesorder.findByPk(salesorderOrderID)
    if (salesOrder == null){
        return `No Sales Order found with SOID: ${salesorderOrderID}`
    }

    const orderStatusHistory = {
        OldStatus,
        NewStatus,
        StatusChangeDate,
        purchaseorderOrderID,
        salesorderOrderID
    }

    const newOrderStatusHistory = await orderstatushistory.create(orderStatusHistory);
    return newOrderStatusHistory

}

const updateOrderStatusHistoryByID = async (oID, params) => {

    const { OldStatus, NewStatus, StatusChangeDate, purchaseorderOrderID, salesorderOrderID } = params

    const purchaseOrder = purchaseorder.findByPk(purchaseorderOrderID)
    if (purchaseOrder == null){
        return `No Purchase Order found with POID: ${purchaseorderOrderID}`
    }

    const salesOrder = salesorder.findByPk(salesorderOrderID)
    if (salesOrder == null){
        return `No Sales Order found with SOID: ${salesorderOrderID}`
    }

    const orderStatusHistory = {
        OldStatus,
        NewStatus,
        StatusChangeDate,
        purchaseorderOrderID,
        salesorderOrderID
    }

    const updatedOrderStatusHistory = orderstatushistory.update(orderStatusHistory, { where: { StatusID: oID } })
    return updatedOrderStatusHistory

}

const deleteOrderStatusHistoryByID = async (oID) => {

    const deletedOrderStatusHistory = orderstatushistory.destroy({ where: { StatusID: oID } })
    return deletedOrderStatusHistory

}

module.exports = {
    getOrderStatusHistoryByID,
    addOrderStatusHistory,
    updateOrderStatusHistoryByID,
    deleteOrderStatusHistoryByID
}