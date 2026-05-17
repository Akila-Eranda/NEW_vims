
const db = require('../models');
const PurchaseOrder = db.purchaseorder
const Inventory = db.inventorytransaction
const PurchaseOrderDetails = db.purchaseorderdetail
const OrderStatuses = db.orderstatushistory
const Products = db.product

const addNewPurchaseOrder = async (params) => {

    const { OrderDate, TotalAmount, Status, Discount, NetAmount } = params;

    const row = await PurchaseOrder.create({ OrderDate, TotalAmount, Status, Discount, NetAmount })

    return row;

}

const getAllPurchaseOrders = async (filter, options) => {
    const PurchaseOrders = await PurchaseOrder.findAll();
    return PurchaseOrders
}

const getPurchaseOrderByID = async (poID) => {
    const PurchaseOrders = await PurchaseOrder.findOne({ where: { OrderID: poID } })
    return PurchaseOrders
}

const updatePurchaseOrderByID = async (poID, updateBody) => {
    const { OrderDate, TotalAmount, Status } = updateBody
    const purchaseOrder = {
        OrderDate,
        TotalAmount,
        Status
    }
    const row = await PurchaseOrder.update(purchaseOrder, { where: { OrderID: poID } })
    return row
}

const deletePurchaseOrderByID = async (poID) => {

    const purchaseOrderItems = await PurchaseOrderDetails.findAll({ where: { OrderID: poID } })
    const inventoryTransactions = await Inventory.findAll({ where: { PurchaseOrderID: poID } })
    const orderStatusHistories = await OrderStatuses.findAll({ where: { purchaseorderOrderID: poID } })

    if (purchaseOrderItems.length !== 0) {

        let shouldTerminate = false
        let pID;

        for (const poItem of purchaseOrderItems) {
            const productQuantity = await Products.findOne({ where: { ProductID: poItem.ProductID } });

            const newQuantity = Number(productQuantity.QuantityInStock) - Number(poItem.Quantity);

            if (newQuantity < 0) {
                pID = poItem.ProductID
                shouldTerminate = true;
                break;
            }
        }

        if (!shouldTerminate) {
            for (const poItem of purchaseOrderItems) {
                const productQuantity = await Products.findOne({ where: { ProductID: poItem.ProductID } });

                const newQuantity = Number(productQuantity.QuantityInStock) - Number(poItem.Quantity);

                await Products.update(
                    { QuantityInStock: newQuantity },
                    { where: { ProductID: poItem.ProductID } }
                );
            }

            await PurchaseOrderDetails.destroy({ where: { OrderID: poID } });
        } else {
            return `Not enough quantity in Product: #${pID}`
        }

    }

    if (inventoryTransactions.length !== 0) {
        await Inventory.destroy({ where: { PurchaseOrderID: poID } })
    }

    if (orderStatusHistories.length !== 0) {
        await OrderStatuses.destroy({ where: { purchaseorderOrderID: poID } })
    }

    const row = await PurchaseOrder.destroy({ where: { OrderID: poID } })
    return row

    // return purchaseOrderItems

}

// ==================== REPORT FUNCTIONS ====================

/**
 * Get Purchase Order Report by Date Range
 * Returns: Product totals, order summaries, supplier analytics
 */
const getPurchaseOrderReport = async ({ startDate, endDate }) => {
    const results = await db.sequelize.query(
        `
        SELECT 
            p.Name AS ProductName,
            SUM(pod.Quantity) AS UnitsPurchased,
            SUM(pod.Quantity * pod.UnitPrice) AS TotalPurchaseCost,
            AVG(pod.UnitPrice) AS AvgUnitPrice
        FROM purchaseorderdetails pod
        JOIN products p ON pod.ProductID = p.ProductID
        JOIN purchaseorders po ON pod.OrderID = po.OrderID
        WHERE po.OrderDate BETWEEN :startDate AND :endDate
        GROUP BY p.Name
        ORDER BY TotalPurchaseCost DESC
        `,
        {
            replacements: { startDate, endDate },
            type: db.sequelize.QueryTypes.SELECT
        }
    );

    const orderSummary = await db.sequelize.query(
        `
        SELECT 
            po.OrderID,
            po.OrderDate,
            po.TotalAmount,
            po.Status,
            po.Discount,
            po.NetAmount,
            COUNT(DISTINCT pod.ProductID) AS ProductCount,
            SUM(pod.Quantity) AS TotalItems
        FROM purchaseorders po
        LEFT JOIN purchaseorderdetails pod ON po.OrderID = pod.OrderID
        WHERE po.OrderDate BETWEEN :startDate AND :endDate
        GROUP BY po.OrderID, po.OrderDate, po.TotalAmount, po.Status, po.Discount, po.NetAmount
        ORDER BY po.OrderDate DESC
        `,
        {
            replacements: { startDate, endDate },
            type: db.sequelize.QueryTypes.SELECT
        }
    );

    const totals = await db.sequelize.query(
        `
        SELECT 
            COUNT(*) AS TotalOrders,
            SUM(TotalAmount) AS GrossTotal,
            SUM(Discount) AS TotalDiscounts,
            SUM(NetAmount) AS NetTotal
        FROM purchaseorders
        WHERE OrderDate BETWEEN :startDate AND :endDate
        `,
        {
            replacements: { startDate, endDate },
            type: db.sequelize.QueryTypes.SELECT
        }
    );

    return {
        productData: results,
        orders: orderSummary,
        summary: totals[0] || { TotalOrders: 0, GrossTotal: 0, TotalDiscounts: 0, NetTotal: 0 }
    };
};

/**
 * Get Purchase Order Status Summary
 * Returns: Count and totals by status (Pending, Approved, Completed, etc.)
 */
const getPurchaseOrderStatusSummary = async () => {
    const results = await db.sequelize.query(
        `
        SELECT 
            Status,
            COUNT(*) AS OrderCount,
            SUM(TotalAmount) AS TotalAmount,
            SUM(NetAmount) AS NetAmount
        FROM purchaseorders
        GROUP BY Status
        ORDER BY OrderCount DESC
        `,
        {
            type: db.sequelize.QueryTypes.SELECT
        }
    );

    return results;
};

/**
 * Get Monthly Purchase Trends
 * Returns: Monthly totals for trend analysis
 */
const getMonthlyPurchaseTrends = async (year) => {
    const results = await db.sequelize.query(
        `
        SELECT 
            MONTH(OrderDate) AS Month,
            YEAR(OrderDate) AS Year,
            COUNT(*) AS OrderCount,
            SUM(TotalAmount) AS TotalAmount,
            SUM(NetAmount) AS NetAmount
        FROM purchaseorders
        WHERE YEAR(OrderDate) = :year
        GROUP BY YEAR(OrderDate), MONTH(OrderDate)
        ORDER BY Month ASC
        `,
        {
            replacements: { year },
            type: db.sequelize.QueryTypes.SELECT
        }
    );

    return results;
};

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