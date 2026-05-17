const db = require('../models');
const Purchaseorderdetail = db.purchaseorderdetail;
const Purchaseorder = db.purchaseorder;
const Product = db.product;
const ProductStorage = db.productstorage;
const InventoryTransaction = db.inventorytransaction;

const getPurchaseOrderDetailsByOrderID = async (orderID) => {

    const purchaseOrderDetailsByOrderID = await Purchaseorderdetail.findAll({ where: { OrderID: orderID }, include: [{ model: db.product, required: true }] })
    return purchaseOrderDetailsByOrderID

}

const addPurchaseOrderDetails = async (params) => {

    const { OrderID, ProductID, Quantity, UnitPrice, LocationID } = params;

    const checkPurchaseOrderID = await Purchaseorder.findByPk(OrderID)
    if (checkPurchaseOrderID == null) {
        return "Invalid Purchase Order ID"
    }

    const checkProductID = await Product.findByPk(ProductID)
    if (checkProductID == null) {
        return "Invalid Product ID"
    }

    const newPurchaseOrderDetail = {
        OrderID,
        ProductID,
        Quantity,
        UnitPrice
    }

    const addPurchaseOrderByOrderID = await Purchaseorderdetail.create(newPurchaseOrderDetail);

    // Update Product global stock (QuantityInStock)
    const currentQty = Number(checkProductID.QuantityInStock) || 0;
    await Product.update(
        { QuantityInStock: currentQty + Number(Quantity) },
        { where: { ProductID } }
    );

    // Update warehouse-level stock (ProductStorage) if LocationID provided
    if (LocationID) {
        const storage = await ProductStorage.findOne({ where: { ProductID, LocationID } });
        if (storage) {
            const storageQty = Number(storage.Quantity) || 0;
            await ProductStorage.update(
                { Quantity: storageQty + Number(Quantity), LastUpdated: new Date() },
                { where: { ProductID, LocationID } }
            );
        } else {
            await ProductStorage.create({
                ProductID,
                LocationID,
                Quantity: Number(Quantity),
                LastUpdated: new Date()
            });
        }

        // Create inventory transaction record
        await InventoryTransaction.create({
            PurchaseOrderID: OrderID,
            ProductID,
            Quantity: Number(Quantity),
            TransactionDate: new Date(),
            TransactionType: 'FULFILL'
        });
    }

    return addPurchaseOrderByOrderID;

}

const updatePurchaseOrderDetails = async (req, body) => {

    const OrderID = req.id
    const ProductID = req.pid

    const { Quantity, UnitPrice } = body;

    const checkPurchaseOrderID = await Purchaseorder.findByPk(OrderID)
    if (checkPurchaseOrderID == null) {
        return "Invalid Purchase Order ID"
    }

    const checkProductID = await Product.findByPk(ProductID)
    if (checkProductID == null) {
        return "Invalid Product ID"
    }

    // Get old quantity to calculate difference
    const oldDetail = await Purchaseorderdetail.findOne({ where: { OrderID, ProductID } });
    const oldQty = oldDetail ? Number(oldDetail.Quantity) : 0;
    const newQty = Number(Quantity);
    const qtyDiff = newQty - oldQty;

    const updatedPurchaseOrderDetail = {
        Quantity,
        UnitPrice
    }

    const updatePurchaseOrderDetail = await Purchaseorderdetail.update(updatedPurchaseOrderDetail, { where: { OrderID, ProductID } })

    // Adjust inventory by the difference
    if (qtyDiff !== 0) {
        const currentStock = Number(checkProductID.QuantityInStock) || 0;
        await Product.update(
            { QuantityInStock: currentStock + qtyDiff },
            { where: { ProductID } }
        );

        // Update warehouse stock if available
        const storages = await ProductStorage.findAll({ where: { ProductID } });
        if (storages.length > 0) {
            const storage = storages[0];
            const storageQty = Number(storage.Quantity) || 0;
            await ProductStorage.update(
                { Quantity: storageQty + qtyDiff, LastUpdated: new Date() },
                { where: { ProductID, LocationID: storage.LocationID } }
            );
        }
    }

    return updatePurchaseOrderDetail

}

const deletePurchaseOrderDetail = async (params) => {

    const OrderID = params.id
    const ProductID = params.pid

    const checkPurchaseOrderID = await Purchaseorder.findByPk(OrderID)
    if (checkPurchaseOrderID == null) {
        return "Invalid Purchase Order ID"
    }

    const checkProductID = await Product.findByPk(ProductID)
    if (checkProductID == null) {
        return "Invalid Product ID"
    }

    // Get quantity before deleting to subtract from inventory
    const detail = await Purchaseorderdetail.findOne({ where: { OrderID, ProductID } });
    if (detail) {
        const qty = Number(detail.Quantity);

        // Subtract from global stock
        const currentStock = Number(checkProductID.QuantityInStock) || 0;
        const newStock = Math.max(0, currentStock - qty);
        await Product.update(
            { QuantityInStock: newStock },
            { where: { ProductID } }
        );

        // Subtract from warehouse stock
        const storages = await ProductStorage.findAll({ where: { ProductID } });
        if (storages.length > 0) {
            const storage = storages[0];
            const storageQty = Number(storage.Quantity) || 0;
            const newStorageQty = Math.max(0, storageQty - qty);
            await ProductStorage.update(
                { Quantity: newStorageQty, LastUpdated: new Date() },
                { where: { ProductID, LocationID: storage.LocationID } }
            );
        }
    }

    const deletedPurchaseOrderDetail = await Purchaseorderdetail.destroy({ where: { OrderID, ProductID } })
    return deletedPurchaseOrderDetail

}

const deletePurchaseOrderDetailsByOrderID = async (orderID) => {

    const checkPurchaseOrderID = await Purchaseorder.findByPk(orderID)
    if (checkPurchaseOrderID == null) {
        return "Invalid Purchase Order ID"
    }

    const deletedPurchaseOrderDetails = await Purchaseorderdetail.destroy({ where: { OrderID: orderID } })
    return deletedPurchaseOrderDetails

}

module.exports = {
    getPurchaseOrderDetailsByOrderID,
    addPurchaseOrderDetails,
    updatePurchaseOrderDetails,
    deletePurchaseOrderDetail,
    deletePurchaseOrderDetailsByOrderID
}