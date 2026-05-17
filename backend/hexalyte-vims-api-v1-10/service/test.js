const db = require('../models')
const salesorder = require('../models/salesorder')
const SalesOrders = db.salesorder
const SalesOrderDetails = db.salesorderdetail
const ReturnOrders = db.returnorders
const ReturnOrderItems = db.returnorderitems
const InventoryTransaction = db.inventorytransaction
const ProductStorage = db.productstorage
const Product = db.product
const User = db.user


const createReturnSalesOrder1 = async (orderId, params) => {
    const {
        OrderDate,
        CreatedBy,
        LocationID,
        Reason,
        ReturnItems = [],
        ExchangeItems = [],
    } = params;

    const response = {
        status: '',
        message: '',
        data: {
            returnOrder: null,
            returnOrderDetails: [],
            exchangeOrderDetails: [],
            inventoryTransactions: [],
            productStorageUpdates: [],
            productQuantityUpdates: [],
            creditBalance: 0
        }
    };

    // Fetch original sales order with items
    const existingOrder = await SalesOrders.findByPk(orderId);
    
    if (!existingOrder) {
        response.status = "error";
        response.message = "Sales Order not found";
        return response;
    }

    if (ReturnItems.length === 0) {
        response.status = "error";
        response.message = "No Return Items Found";
        return response;
    }

    // Get previous returns for quantity validation
    const previousReturns = await ReturnOrders.findAll({
        where: { SalesOrderID: orderId },
        include: [ReturnOrderItems]
    });

    // Calculate already returned quantities
    const returnedQuantities = {};
    previousReturns.forEach(returnOrder => {
        returnOrder.ReturnOrderItems.forEach(item => {
            const prodId = item.ProductID;
            returnedQuantities[prodId] = (returnedQuantities[prodId] || 0) + parseInt(item.Quantity);
        });
    });

    // Validate return items
    for (const returnItem of ReturnItems) {
        const salesOrderItem = existingOrder.items.find(i => i.ProductID === returnItem.ProductID);
        
        if (!salesOrderItem) {
            response.status = "error";
            response.message = `Product ${returnItem.ProductID} not in original order`;
            return response;
        }

        const originalQty = parseInt(salesOrderItem.Quantity);
        const alreadyReturned = returnedQuantities[returnItem.ProductID] || 0;
        const availableToReturn = originalQty - alreadyReturned;
        const requestedQty = parseInt(returnItem.Quantity);

        if (requestedQty <= 0) {
            response.status = "error";
            response.message = `Invalid quantity for product ${returnItem.ProductID}`;
            return response;
        }

        if (requestedQty > availableToReturn) {
            response.status = "error";
            response.message = `Cannot return ${requestedQty} of product ${returnItem.ProductID} (only ${availableToReturn} available)`;
            return response;
        }
    }

    // Calculate return total
    const returnTotal = ReturnItems.reduce((sum, item) => {
        const product = existingOrder.items.find(i => i.ProductID === item.ProductID);
        return sum + (parseInt(item.Quantity) * parseFloat(product.UnitPrice));
    }, 0);

    // Validate exchange items
    let exchangeTotal = 0;
    const location = LocationID || existingOrder.LocationID;
    
    if (ExchangeItems.length > 0) {
        for (const exchangeItem of ExchangeItems) {
            exchangeTotal += (parseInt(exchangeItem.Quantity) * parseFloat(exchangeItem.UnitPrice));
            
            // Stock validation
            const productStock = await ProductStorage.findOne({
                where: { ProductID: exchangeItem.ProductID, LocationID: location }
            });

            if (!productStock || parseInt(productStock.Quantity) < parseInt(exchangeItem.Quantity)) {
                response.status = "error";
                response.message = `Insufficient stock for exchange product ${exchangeItem.ProductID}`;
                response.data.creditBalance = returnTotal;
                return response;
            }
        }

        if (exchangeTotal > returnTotal) {
            response.status = "error";
            response.message = `Exchange value (${exchangeTotal}) exceeds return credit (${returnTotal})`;
            response.data.creditBalance = returnTotal;
            return response;
        }
    }

    const transaction = await db.sequelize.transaction();
    try {
        // Create return order
        const returnOrder = await ReturnOrders.create({
            SalesOrderID: orderId,
            ReturnDate: OrderDate || new Date(),
            Reason,
            CreatedBy,
            TotalAmount: -returnTotal,
            Status: 'PROCESSED',
            LocationID: location
        }, { transaction });

        response.data.returnOrder = returnOrder;

        // Process return items
        for (const returnItem of ReturnItems) {
            const salesOrderItem = existingOrder.items.find(i => i.ProductID === returnItem.ProductID);
            const quantity = parseInt(returnItem.Quantity);

            // Create return item record
            const returnDetail = await ReturnOrderItems.create({
                ReturnID: returnOrder.ReturnID,
                ProductID: returnItem.ProductID,
                Quantity: quantity,
                UnitPrice: salesOrderItem.UnitPrice,
                Note: returnItem.Note || ''
            }, { transaction });
            response.data.returnOrderDetails.push(returnDetail);

            // Restock inventory
            const inventoryTx = await InventoryTransaction.create({
                ReferenceID: returnOrder.ReturnID,
                ProductID: returnItem.ProductID,
                Quantity: quantity,
                TransactionType: 'RETURN',
                TransactionDate: OrderDate || new Date(),
                LocationID: location
            }, { transaction });
            response.data.inventoryTransactions.push(inventoryTx);

            // Update storage
            await ProductStorage.increment('Quantity', {
                by: quantity,
                where: { ProductID: returnItem.ProductID, LocationID: location },
                transaction
            });

            // Update product stock
            await Product.increment('QuantityInStock', {
                by: quantity,
                where: { ProductID: returnItem.ProductID },
                transaction
            });
        }

        // Process exchange items
        let creditBalance = returnTotal;
        
        for (const exchangeItem of ExchangeItems) {
            const quantity = parseInt(exchangeItem.Quantity);
            const itemValue = quantity * parseFloat(exchangeItem.UnitPrice);
            
            // Link exchange to original order
            const exchangeDetail = await SalesOrderDetails.create({
                OrderID: orderId,
                ProductID: exchangeItem.ProductID,
                Quantity: quantity,
                UnitPrice: exchangeItem.UnitPrice,
                IsExchange: true,
                ReturnReferenceID: returnOrder.ReturnID
            }, { transaction });
            response.data.exchangeOrderDetails.push(exchangeDetail);

            // Deduct inventory
            const inventoryTx = await InventoryTransaction.create({
                ReferenceID: returnOrder.ReturnID,
                ProductID: exchangeItem.ProductID,
                Quantity: -quantity,
                TransactionType: 'EXCHANGE',
                TransactionDate: OrderDate || new Date(),
                LocationID: location
            }, { transaction });
            response.data.inventoryTransactions.push(inventoryTx);

            // Update storage
            await ProductStorage.decrement('Quantity', {
                by: quantity,
                where: { ProductID: exchangeItem.ProductID, LocationID: location },
                transaction
            });

            // Update product stock
            await Product.decrement('QuantityInStock', {
                by: quantity,
                where: { ProductID: exchangeItem.ProductID },
                transaction
            });

            creditBalance -= itemValue;
        }

        response.data.creditBalance = creditBalance;
        await transaction.commit();

        response.status = 'success';
        response.message = 'Return processed with $' + Math.abs(returnTotal) + ' credit';
        if (ExchangeItems.length > 0) {
            response.message += ` ($${creditBalance} remaining credit)`;
        }
        
        return response;
    } catch (error) {
        await transaction.rollback();
        response.status = "error";
        response.message = `Transaction failed: ${error.message}`;
        return response;
    }
};


const createReturnSalesOrder = async (orderId, params) => {
    const {
        OrderDate,
        TotalAmount,
        Status,
        CustomerID,
        TransactionType,
        LocationID,
        Reason,
        ReturnItems = [],
        ExchangeItems = [],
    } = params;

    let response = {
        Status: '',
        message: '',
        data: {
            returnOrder: null,
            returnOrderDetails: [],
            exchangeOrderDetails: [],
            inventoryTransactions: [],
            productStorageUpdates: [],
            productQuantityUpdates: [],
            creditBalance: 0
        }
    };

    const existingOrder = await Salesorder.findByPk(orderId);
    if (!existingOrder) {
        response.Status = "Sales Order not found";
        return response;
    }

    if (OrderItems.length === 0) {
        response.Status = "No Order Items Found";
        return response;
    }

    // Validate return items
    for (const returnItem of ReturnItems) {
        const salesOrderItem = salesorder.items.find(i => i.ProductID === returnItem.ProductID);

        if (!salesOrderItem) {
            return {
                ...responseTemplate,
                status: 'error',
                message: `Product ${returnItem.ProductID} not in original order`
            };
        }

        const originalQty = parseInt(salesOrderItem.Quantity);
        const alreadyReturned = returnedQuantities[returnItem.ProductID] || 0;
        const availableToReturn = originalQty - alreadyReturned;
        const requestedQty = parseInt(returnItem.Quantity);

        if (requestedQty <= 0) {
            return {
                ...responseTemplate,
                status: 'error',
                message: `Invalid quantity for product ${returnItem.ProductID}`
            };
        }

        if (requestedQty > availableToReturn) {
            return {
                ...responseTemplate,
                status: 'error',
                message: `Cannot return ${requestedQty} of product ${returnItem.ProductID} (only ${availableToReturn} available)`
            };
        }
    }

    // Calculate return total
    const returnTotal = ReturnItems.reduce((sum, item) => {
        const product = salesorder.items.find(i => i.ProductID === item.ProductID);
        return sum + (parseInt(item.Quantity) * parseFloat(product.UnitPrice));
    }, 0);

    // Validate exchange items if provided
    if (ExchangeItems && ExchangeItems.length > 0) {
        // Calculate exchange total
        const exchangeTotal = ExchangeItems.reduce((sum, item) => {
            return sum + (parseInt(item.Quantity) * parseFloat(item.UnitPrice));
        }, 0);

        if (exchangeTotal > returnTotal) {
            return {
                ...responseTemplate,
                status: 'error',
                message: `Exchange value (${exchangeTotal}) exceeds return credit (${returnTotal})`,
                data: { ...responseTemplate.data, creditBalance: returnTotal }
            };
        }

        // Check stock for exchange items
        for (const exchangeItem of ExchangeItems) {
            const productStock = await ProductStorage.findOne({
                where: {
                    ProductID: exchangeItem.ProductID,
                    LocationID: LocationID || salesorder.LocationID
                }
            });

            if (!productStock || productStock.Quantity < exchangeItem.Quantity) {
                return {
                    ...responseTemplate,
                    status: 'error',
                    message: `Insufficient stock for exchange product ${exchangeItem.ProductID}`,
                    data: { ...responseTemplate.data, creditBalance: returnTotal }
                };
            }
        }
    }

    const transaction = await db.sequelize.transaction();
    try {
        const returnOrder = await ReturnOrders.create({
            SalesOrderID,
            ReturnDate: ReturnDate || new Date(),
            Reason,
            CreatedBy,
            TotalAmount: -returnTotal, // Negative amount for return
            Status: 'PROCESSED',
            LocationID: LocationID
        }, { transaction });

        // Process return items (restock inventory)
        for (const returnItem of ReturnItems) {
            const salesOrderItem = salesorder.items.find(i => i.ProductID === returnItem.ProductID);

            // Create return order item
            const returnDetail = await ReturnOrderItems.create({
                ReturnID: returnOrder.ReturnID,
                ProductID: returnItem.ProductID,
                Quantity: returnItem.Quantity,
                UnitPrice: salesOrderItem.UnitPrice,
                Note: returnItem.Note || ''
            }, { transaction });

            responseTemplate.data.returnOrderDetails.push(returnDetail);

            // Restock inventory
            const inventoryTx = await InventoryTransaction.create({
                ReferenceID: returnOrder.ReturnID,
                ProductID: returnItem.ProductID,
                Quantity: returnItem.Quantity,
                TransactionType: 'RETURN',
                TransactionDate: ReturnDate || new Date(),
                LocationID: LocationID
            }, { transaction });

            responseTemplate.data.inventoryTransactions.push(inventoryTx);

            // Update product storage
            const storageUpdate = await ProductStorage.increment('Quantity', {
                by: returnItem.Quantity,
                where: {
                    ProductID: returnItem.ProductID,
                    LocationID: LocationID
                },
                transaction
            });

            responseTemplate.data.productStorageUpdates.push(storageUpdate);

            // Update product quantity
            const productUpdate = await Product.increment('QuantityInStock', {
                by: returnItem.Quantity,
                where: { ProductID: returnItem.ProductID },
                transaction
            });

            responseTemplate.data.productQuantityUpdates.push(productUpdate);
        }


        // Process exchange items if any
        let creditBalance = returnTotal;

        if (ExchangeItems && ExchangeItems.length > 0) {
            for (const exchangeItem of ExchangeItems) {
                // Create exchange order item (as positive quantity)
                const exchangeDetail = await SalesOrderDetails.create({
                    OrderID: SalesOrderID, // Link to original order
                    ProductID: exchangeItem.ProductID,
                    Quantity: exchangeItem.Quantity,
                    UnitPrice: exchangeItem.UnitPrice,
                    IsExchange: true,
                    ReturnReferenceID: returnOrder.ReturnID
                }, { transaction });

                responseTemplate.data.exchangeOrderDetails.push(exchangeDetail);

                // Deduct inventory for exchange
                const inventoryTx = await InventoryTransaction.create({
                    ReferenceID: returnOrder.ReturnID,
                    ProductID: exchangeItem.ProductID,
                    Quantity: -exchangeItem.Quantity, // Negative for deduction
                    TransactionType: 'EXCHANGE',
                    TransactionDate: ReturnDate || new Date(),
                    LocationID: LocationID || salesorder.LocationID
                }, { transaction });

                responseTemplate.data.inventoryTransactions.push(inventoryTx);

                // Update product storage
                const storageUpdate = await ProductStorage.decrement('Quantity', {
                    by: exchangeItem.Quantity,
                    where: {
                        ProductID: exchangeItem.ProductID,
                        LocationID: LocationID || salesorder.LocationID
                    },
                    transaction
                });

                responseTemplate.data.productStorageUpdates.push(storageUpdate);

                // Update product quantity
                const productUpdate = await Product.decrement('QuantityInStock', {
                    by: exchangeItem.Quantity,
                    where: { ProductID: exchangeItem.ProductID },
                    transaction
                });

                responseTemplate.data.productQuantityUpdates.push(productUpdate);

                // Update credit balance
                creditBalance -= (exchangeItem.Quantity * exchangeItem.UnitPrice);
            }
        }

        responseTemplate.data.creditBalance = creditBalance;
        responseTemplate.data.returnOrder = returnOrder;


        await transaction.commit();

        return {
            ...responseTemplate,
            status: 'success',
            message: 'Return order processed successfully',
        };
    } catch (error) {
        await transaction.rollback();
        response.Status = `Update failed: ${error.message}`;
        return response;
    }
};
