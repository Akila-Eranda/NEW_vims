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

// const createReturnSalesOrder = async (params) => {

//     const { SalesOrderID, ReturnDate, Reason, CreatedBy, ReturnItems } = params

//     const checkUser = await User.findAll({ where: { id: CreatedBy } })

//     if (checkUser == null || checkUser.length == 0) {
//         return "no user with matching id found"
//     }

//     const checkSalesOrder = await SalesOrders.findAll({ where: { OrderID: SalesOrderID } })

//     if (checkSalesOrder == null || checkSalesOrder.length == 0) {
//         return "no sales orders found"
//     }

//     const checkSalesOrderItems = await SalesOrderDetails.findAll({ where: { OrderID: SalesOrderID } })

//     if (checkSalesOrderItems == null || checkSalesOrderItems.length == 0) {
//         return "no sales order items"
//     }

//     let proceed = true
//     let response = { status: '', message: '' }

//     for (const returnItem of ReturnItems) {

//         const salesOrderItem = await SalesOrderDetails.findOne({ where: { ProductID: returnItem.ProductID } })

//         if (salesOrderItem == null) {
//             response.message = `No product with ${returnItem.ProductID} ID found in the sales order`
//             proceed = false
//             break
//         }

//         if (parseInt(salesOrderItem.Quantity) < parseInt(returnItem.Quantity)) {
//             response.message = `No available quantity of product ${returnItem.ProductID}`
//             proceed = false
//             break
//         }

//     }

//     const checkExistingReturns = await ReturnOrders.findAll({ where: { SalesOrderID } })

//     if (checkExistingReturns !== null || checkExistingReturns.length !== 0) {

//         for (const existingReturn of checkExistingReturns) {



//         }

//     }


//     return {
//         checkSalesOrder,
//         checkSalesOrderItems,
//         response
//     }

// }

// const createReturnSalesOrder = async (params) => {
//     const { SalesOrderID, ReturnDate, Reason, CreatedBy, ReturnItems } = params;

//     try {
//         // Check if user exists
//         const checkUser = await User.findByPk(CreatedBy);
//         if (!checkUser) {
//             return {
//                 status: 'error',
//                 message: 'No user with matching ID found'
//             };
//         }

//         // Check if sales order exists
//         const salesOrder = await SalesOrders.findOne({ where: { OrderID: SalesOrderID } });
//         if (!salesOrder) {
//             return {
//                 status: 'error',
//                 message: 'No sales order found'
//             };
//         }

//         // Get all sales order items
//         const salesOrderItems = await SalesOrderDetails.findAll({
//             where: { OrderID: SalesOrderID }
//         });
//         if (!salesOrderItems || salesOrderItems.length === 0) {
//             return {
//                 status: 'error',
//                 message: 'No sales order items found'
//             };
//         }

//         // Get existing returns for this sales order
//         const existingReturns = await ReturnOrders.findAll({
//             where: { SalesOrderID },
//             include: [{
//                 model: ReturnOrderItems
//             }]
//         });

//         // Calculate already returned quantities
//         const returnedQuantities = {};
//         if (existingReturns && existingReturns.length > 0) {
//             for (const returnOrder of existingReturns) {
//                 if (returnOrder.returnItems) {
//                     for (const returnItem of returnOrder.returnorderitems) {
//                         const productId = returnItem.ProductID;
//                         returnedQuantities[productId] = (returnedQuantities[productId] || 0) + parseInt(returnItem.Quantity);
//                     }
//                 }
//             }
//         }

//         // Validate return items
//         for (const returnItem of ReturnItems) {
//             const salesOrderItem = salesOrderItems.find(item =>
//                 item.ProductID === returnItem.ProductID
//             );

//             if (!salesOrderItem) {
//                 return {
//                     status: 'error',
//                     message: `Product with ID ${returnItem.ProductID} not found in the sales order`
//                 };
//             }

//             const originalQuantity = parseInt(salesOrderItem.Quantity);
//             const alreadyReturned = returnedQuantities[returnItem.ProductID] || 0;
//             const availableForReturn = originalQuantity - alreadyReturned;
//             const requestedQuantity = parseInt(returnItem.Quantity);

//             if (requestedQuantity > availableForReturn) {
//                 return {
//                     status: 'error',
//                     message: `Insufficient quantity for product ${returnItem.ProductID}. Available for return: ${availableForReturn}, requested: ${requestedQuantity}`
//                 };
//             }

//             if (requestedQuantity <= 0) {
//                 return {
//                     status: 'error',
//                     message: `Invalid quantity for product ${returnItem.ProductID}. Quantity must be greater than 0`
//                 };
//             }
//         }

//         // Create the return order
//         const transaction = await db.sequelize.transaction(); // Assuming you're using Sequelize transactions

//         try {
//             // Generate return order ID (adjust logic as needed)
//             // const returnOrderId = `RET-${Date.now()}`;

//             // Create return order
//             const returnOrder = await ReturnOrders.create({
//                 // ReturnOrderID: returnOrderId,
//                 SalesOrderID,
//                 ReturnDate: ReturnDate || new Date(),
//                 Reason,
//                 CreatedBy,
//                 // Status: 'Pending', // Adjust default status as needed
//                 CreatedAt: new Date(),
//                 UpdatedAt: new Date()
//             }, { transaction });

//             // Create return order details
//             const returnOrderDetails = [];
//             for (const returnItem of ReturnItems) {
//                 const salesOrderItem = salesOrderItems.find(item =>
//                     item.ProductID === returnItem.ProductID
//                 );

//                 const returnOrderDetail = await ReturnOrderItems.create({
//                     ReturnID: returnOrder.ReturnID,
//                     ProductID: returnItem.ProductID,
//                     Quantity: returnItem.Quantity,
//                     // UnitPrice: salesOrderItem.UnitPrice, // Use original price
//                     // TotalAmount: parseFloat(salesOrderItem.UnitPrice) * parseInt(returnItem.Quantity),
//                     // Reason: returnItem.Reason || '', // Item-specific reason or general reason
//                     CreatedAt: new Date(),
//                     UpdatedAt: new Date()
//                 }, { transaction });

//                 returnOrderDetails.push(returnOrderDetail);
//             }

//             // Commit transaction
//             await transaction.commit();

//             return {
//                 status: 'success',
//                 message: 'Return order created successfully',
//                 data: {
//                     returnOrder,
//                     returnOrderDetails
//                 }
//             };

//         } catch (error) {
//             // Rollback transaction on error
//             await transaction.rollback();
//             throw error;
//         }

//     } catch (error) {
//         console.error('Error creating return sales order:', error);
//         return {
//             status: 'error',
//             message: 'An error occurred while creating the return order',
//             error: error.message
//         };
//     }
// };


const createReturnSalesOrder = async (orderId, params) => {
    const {
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
            creditBalance: 0,
            payableAmount: 0
        }
    };

    try {
        // Fetch original sales order
        const existingOrder = await SalesOrders.findByPk(orderId);
        if (!existingOrder) {
            response.status = "error";
            response.message = "Sales Order not found";
            return response;
        }

        // Fetch order items
        const orderItems = await SalesOrderDetails.findAll({
            where: { OrderID: orderId }
        });

        if (orderItems.length === 0) {
            response.status = "error";
            response.message = "No items found in original order";
            return response;
        }

        if (ReturnItems.length === 0) {
            response.status = "error";
            response.message = "No return items specified";
            return response;
        }


        const previousReturns = await ReturnOrders.findAll({
            where: { SalesOrderID: orderId },
            include: [{ model: ReturnOrderItems, attributes: ['ProductID', 'Quantity', 'Note'] }],
        });

        // Correct loop
        const returnedQuantities = {};
        for (const returnOder of previousReturns) {
            const items = returnOder.returnorderitems ?? [];
            for (const item of items) {
                const pid = item.ProductID;
                returnedQuantities[pid] = (returnedQuantities[pid] || 0) + parseInt(item.Quantity, 10);
            }
        }
        // // Get previous returns
        // const previousReturns = await ReturnOrders.findAll({
        //     where: { SalesOrderID: orderId },
        //     include: [
        //         { model: ReturnOrderItems }
        //     ]
        // });
        // console.log(previousReturns);

        // // Calculate returned quantities
        // const returnedQuantities = {};
        // previousReturns.forEach(returnOrders => {
        //     returnOrders.ReturnOrderItems.forEach(item => {
        //         const prodId = item.ProductID;
        //         returnedQuantities[prodId] = (returnedQuantities[prodId] || 0) + parseInt(item.Quantity);
        //     });
        // });
        // console.log(returnedQuantities)

        // Validate return items
        for (const returnItem of ReturnItems) {
            const salesOrderItem = orderItems.find(i => i.ProductID === returnItem.ProductID);

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
            const product = orderItems.find(i => i.ProductID === item.ProductID);
            return sum + (parseInt(item.Quantity) * parseFloat(product.UnitPrice));
        }, 0);

        // Validate exchange items
        const location = LocationID || existingOrder.LocationID;
        let exchangeTotal = 0;

        if (ExchangeItems.length > 0) {
            for (const exchangeItem of ExchangeItems) {
                const quantity = parseInt(exchangeItem.Quantity);
                if (quantity <= 0) {
                    response.status = "error";
                    response.message = `Invalid quantity for exchange product ${exchangeItem.ProductID}`;
                    return response;
                }

                exchangeTotal += (quantity * parseFloat(exchangeItem.UnitPrice));

                // Stock validation
                const productStock = await ProductStorage.findOne({
                    where: { ProductID: exchangeItem.ProductID, LocationID: location }
                });

                if (!productStock) {
                    response.status = "error";
                    response.message = `Product ${exchangeItem.ProductID} not found at location ${location}`;
                    return response;
                }

                if (parseInt(productStock.Quantity) < quantity) {
                    response.status = "error";
                    response.message = `Insufficient stock for exchange product ${exchangeItem.ProductID} (requested: ${quantity}, available: ${productStock.Quantity})`;
                    return response;
                }
            }
        }

        const transaction = await db.sequelize.transaction();
        try {
            // Create return order
            const returnOrder = await ReturnOrders.create({
                SalesOrderID: orderId,
                ReturnDate: new Date(),
                Reason,
                CreatedBy,
                TotalAmount: -returnTotal,
                Status: 'PROCESSED',
                LocationID: location
            }, { transaction });

            response.data.returnOrder = returnOrder;

            // Process return items
            for (const returnItem of ReturnItems) {
                const salesOrderItem = orderItems.find(i => i.ProductID === returnItem.ProductID);
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
                    TransactionDate: new Date(),
                    LocationID: location,
                    SalesOrderID: orderId
                }, { transaction });
                response.data.inventoryTransactions.push(inventoryTx);

                // Update storage - FIXED: use location variable instead of LocationID
                await ProductStorage.increment('Quantity', {
                    by: quantity,
                    where: { ProductID: returnItem.ProductID, LocationID },
                    transaction
                });

                // const row = await ProductStorage.findOne({
                //     where: { ProductID: returnItem.ProductID, LocationID:location }
                // });
                // console.log(row ? row.toJSON() : 'No match found');
                // console.log(returnItem.ProductID);
                // console.log(location);


                // Update product stock
                await Product.increment('QuantityInStock', {
                    by: quantity,
                    where: { ProductID: returnItem.ProductID },
                    transaction
                });
            }

            // Process exchange items
            // Credit = Return Total - Order Discount - Exchange Total
            const orderDiscount = parseFloat(existingOrder.Discount) || 0;
            let creditBalance = returnTotal - orderDiscount;

            for (const exchangeItem of ExchangeItems) {
                const quantity = parseInt(exchangeItem.Quantity);
                const itemValue = quantity * parseFloat(exchangeItem.UnitPrice);

                // Link exchange to original order
                // const exchangeDetail = await SalesOrderDetails.create({
                //     OrderID: orderId,
                //     ProductID: exchangeItem.ProductID,
                //     Quantity: quantity,
                //     UnitPrice: exchangeItem.UnitPrice,
                //     IsExchange: true,
                //     ReturnReferenceID: returnOrder.ReturnID
                // }, { transaction });
                // response.data.exchangeOrderDetails.push(exchangeDetail);

                const existingDetail = await SalesOrderDetails.findOne({
                    where: { OrderID: orderId, ProductID: exchangeItem.ProductID },
                    transaction
                });

                if (existingDetail) {
                    await existingDetail.increment('Quantity', { by: quantity, transaction });
                } else {
                    await SalesOrderDetails.create({
                        OrderID: orderId,
                        ProductID: exchangeItem.ProductID,
                        Quantity: quantity,
                        UnitPrice: exchangeItem.UnitPrice,
                        IsExchange: true,
                        ReturnReferenceID: returnOrder.ReturnID
                    }, { transaction });
                }

                // Deduct inventory
                const inventoryTx = await InventoryTransaction.create({
                    ReferenceID: returnOrder.ReturnID,
                    ProductID: exchangeItem.ProductID,
                    Quantity: quantity,
                    TransactionType: 'EXCHANGE',
                    TransactionDate: new Date(),
                    LocationID: location,
                    SalesOrderID: orderId
                }, { transaction });
                response.data.inventoryTransactions.push(inventoryTx);

                // Update storage
                await ProductStorage.decrement('Quantity', {
                    by: quantity,
                    where: { ProductID: exchangeItem.ProductID, LocationID },
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

            if (creditBalance < 0) {
                response.data.payableAmount = -creditBalance;
                creditBalance = 0;
            }

            response.data.creditBalance = creditBalance;
            
            // Update sales order status to RETURNED
            await SalesOrders.update(
                { Status: 'RETURNED' },
                { where: { OrderID: orderId }, transaction }
            );
            
            await transaction.commit();

            response.status = 'success';
            response.message = 'Return processed successfully';

            if (ExchangeItems.length > 0) {
                if (response.data.payableAmount > 0) {
                    response.message += ` with LKR${response.data.payableAmount.toFixed(2)} payable by customer`;
                } else {
                    response.message += ` with LKR${creditBalance.toFixed(2)} remaining credit`;
                }
            }

            return response;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        response.status = "error";
        response.message = `Operation failed: ${error}`;
        console.log(error);
        return response;
    }
};


const createReturnSalesOrder2 = async (orderId, params) => {
    const {
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

    try {
        // Fetch original sales order
        const existingOrder = await SalesOrders.findByPk(orderId);
        if (!existingOrder) {
            response.status = "error";
            response.message = "Sales Order not found";
            return response;
        }

        // Fetch order items
        const orderItems = await SalesOrderDetails.findAll({
            where: { OrderID: orderId }
        });

        if (orderItems.length === 0) {
            response.status = "error";
            response.message = "No items found in original order";
            return response;
        }

        if (ReturnItems.length === 0) {
            response.status = "error";
            response.message = "No return items specified";
            return response;
        }

        // Get previous returns
        const previousReturns = await ReturnOrders.findAll({
            where: { SalesOrderID: orderId },
            include: [ReturnOrderItems]
        });

        // Calculate returned quantities
        const returnedQuantities = {};
        previousReturns.forEach(returnOrder => {
            returnOrder.ReturnOrderItems.forEach(item => {
                const prodId = item.ProductID;
                returnedQuantities[prodId] = (returnedQuantities[prodId] || 0) + parseInt(item.Quantity);
            });
        });

        // Validate return items
        for (const returnItem of ReturnItems) {
            const salesOrderItem = orderItems.find(i => i.ProductID === returnItem.ProductID);

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
            const product = orderItems.find(i => i.ProductID === item.ProductID);
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
                ReturnDate: new Date(),
                Reason,
                CreatedBy,
                TotalAmount: -returnTotal,
                Status: 'PROCESSED',
                LocationID: location
            }, { transaction });

            response.data.returnOrder = returnOrder;

            // Process return items
            for (const returnItem of ReturnItems) {
                const salesOrderItem = orderItems.find(i => i.ProductID === returnItem.ProductID);
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
                    TransactionDate: new Date(),
                    LocationID: location,
                    SalesOrderID: orderId
                }, { transaction });
                response.data.inventoryTransactions.push(inventoryTx);

                // Update storage
                await ProductStorage.increment('Quantity', {
                    by: quantity,
                    where: { ProductID: returnItem.ProductID, LocationID: LocationID },
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
                    Quantity: quantity,
                    TransactionType: 'EXCHANGE',
                    TransactionDate: new Date(),
                    LocationID: location,
                    SalesOrderID: orderId
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

                console.log(itemValue);

                creditBalance -= itemValue;
            }

            console.log(creditBalance);

            response.data.creditBalance = creditBalance;
            await transaction.commit();

            response.status = 'success';
            response.message = 'Return processed successfully';
            if (ExchangeItems.length > 0) {
                response.message += ` with LKR${creditBalance.toFixed(2)} remaining credit`;
            }

            return response;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        response.status = "error";
        response.message = `Operation failed: ${error.message}`;
        return response;
    }
};







const getAllReturnOrders = async () => {

    const allReturnOrders = await ReturnOrders.findAll({
        include: [{
            model: ReturnOrderItems,
            include: [{
                model: Product
            }]
        }]
    });

    if (allReturnOrders == null || allReturnOrders.length == 0) return `no return orders found`

    return allReturnOrders

}

const createReturnSalesOrder1 = async (params) => {
    const { SalesOrderID, ReturnDate, Reason, CreatedBy, ReturnItems } = params;

    try {
        // Check if user exists
        const checkUser = await User.findByPk(CreatedBy);
        if (!checkUser) {
            return {
                status: 'error',
                message: 'No user with matching ID found'
            };
        }

        // Check if sales order exists
        const salesOrder = await SalesOrders.findOne({ where: { OrderID: SalesOrderID } });
        if (!salesOrder) {
            return {
                status: 'error',
                message: 'No sales order found'
            };
        }

        // Get all sales order items
        const salesOrderItems = await SalesOrderDetails.findAll({
            where: { OrderID: SalesOrderID }
        });
        if (!salesOrderItems || salesOrderItems.length === 0) {
            return {
                status: 'error',
                message: 'No sales order items found'
            };
        }

        // Get existing returns for this sales order
        const existingReturns = await ReturnOrders.findAll({
            where: { SalesOrderID },
            include: [{
                model: ReturnOrderItems
            }]
        });

        // Calculate already returned quantities
        const returnedQuantities = {};
        if (existingReturns && existingReturns.length > 0) {
            for (const returnOrder of existingReturns) {
                if (returnOrder.returnorderitems) {
                    for (const returnItem of returnOrder.returnorderitems) {
                        const productId = returnItem.ProductID;
                        returnedQuantities[productId] = (returnedQuantities[productId] || 0) + parseInt(returnItem.Quantity);
                    }
                }
            }
        }

        // Validate return items
        for (const returnItem of ReturnItems) {
            const salesOrderItem = salesOrderItems.find(item =>
                item.ProductID === returnItem.ProductID
            );

            if (!salesOrderItem) {
                return {
                    status: 'error',
                    message: `Product with ID ${returnItem.ProductID} not found in the sales order`
                };
            }

            const originalQuantity = parseInt(salesOrderItem.Quantity);
            const alreadyReturned = returnedQuantities[returnItem.ProductID] || 0;
            const availableForReturn = originalQuantity - alreadyReturned;
            const requestedQuantity = parseInt(returnItem.Quantity);

            if (requestedQuantity > availableForReturn) {
                return {
                    status: 'error',
                    message: `Insufficient quantity for product ${returnItem.ProductID}. Available for return: ${availableForReturn}, requested: ${requestedQuantity}`
                };
            }

            if (requestedQuantity <= 0) {
                return {
                    status: 'error',
                    message: `Invalid quantity for product ${returnItem.ProductID}. Quantity must be greater than 0`
                };
            }
        }

        // Create the return order
        const transaction = await db.sequelize.transaction();

        try {
            // Create return order
            const returnOrder = await ReturnOrders.create({
                SalesOrderID,
                ReturnDate: ReturnDate || new Date(),
                Reason,
                CreatedBy,
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            }, { transaction });

            // Create return order details
            const returnOrderDetails = [];
            const inventoryTransactionDetails = []
            const productStorageDetails = []
            const productQuantityDetails = []
            for (const returnItem of ReturnItems) {
                const salesOrderItem = salesOrderItems.find(item =>
                    item.ProductID === returnItem.ProductID
                );

                const returnOrderDetail = await ReturnOrderItems.create({
                    ReturnID: returnOrder.ReturnID,
                    ProductID: returnItem.ProductID,
                    Quantity: returnItem.Quantity,
                    Note: returnItem.Note || '',
                    CreatedAt: new Date(),
                    UpdatedAt: new Date()
                }, { transaction });

                returnOrderDetails.push(returnOrderDetail);

                const inventoryTransactionDetail = await InventoryTransaction.create({
                    SalesOrderID,
                    ProductID: returnItem.ProductID,
                    Quantity: returnItem.Quantity,
                    TransactionDate: ReturnDate,
                    TransactionType: 'RETURN'
                }, { transaction })

                inventoryTransactionDetails.push(inventoryTransactionDetail)

                const productStorageUpdate = await ProductStorage.increment('Quantity', {
                    by: returnItem.Quantity,
                    where: { ProductID: returnItem.ProductID, LocationID: salesOrder.LocationID },
                    transaction
                })

                productStorageDetails.push(productStorageUpdate)

                const productQuantityUpdate = await Product.increment('QuantityInStock', {
                    by: returnItem.Quantity,
                    where: { ProductID: returnItem.ProductID },
                    transaction
                })

                productQuantityDetails.push(productQuantityUpdate)

            }

            // Commit transaction
            await transaction.commit();

            return {
                status: 'success',
                message: 'Return order created successfully',
                data: {
                    returnOrder,
                    returnOrderDetails,
                    inventoryTransactionDetails,
                    productStorageDetails,
                    productQuantityDetails
                }
            };

        } catch (error) {
            // Rollback transaction on error
            await transaction.rollback();
            throw error;
        }

    } catch (error) {
        console.error('Error creating return sales order:', error);
        return {
            status: 'error',
            message: 'An error occurred while creating the return order',
            error: error.message
        };
    }
};

// Helper function to get return summary for a sales order
const getReturnSummary = async (salesOrderId) => {
    try {
        const returns = await ReturnOrders.findAll({
            where: { SalesOrderID: salesOrderId },
            include: [{
                model: ReturnOrderItems
            }]
        });

        const summary = {};
        for (const returnOrder of returns) {
            if (returnOrder.returnorderitems) {
                for (const item of returnOrder.returnorderitems) {
                    const productId = item.ProductID;
                    if (!summary[productId]) {
                        summary[productId] = {
                            totalReturned: 0,
                            returns: []
                        };
                    }
                    summary[productId].totalReturned += parseInt(item.Quantity);
                    summary[productId].returns.push({
                        returnId: returnOrder.ReturnID,
                        quantity: item.Quantity,
                        date: returnOrder.ReturnDate,
                        reason: returnOrder.Reason,
                        note: item.Note
                    });
                }
            }
        }

        return summary;
    } catch (error) {
        console.error('Error getting return summary:', error);
        return {};
    }
};

// ==================== NEW FUNCTIONS ====================

/**
 * Get Return Order by ID
 * Returns single return order with items and product details
 */
const getReturnOrderById = async (returnId) => {
    try {
        const returnOrder = await ReturnOrders.findByPk(returnId, {
            include: [
                {
                    model: ReturnOrderItems,
                    include: [{ model: Product }]
                },
                { model: SalesOrders },
                { model: User, attributes: ['id', 'username', 'firstname', 'lastname', 'email'] }
            ]
        });

        if (!returnOrder) {
            return { status: 'error', message: 'Return order not found' };
        }

        return { status: 'success', data: returnOrder };
    } catch (error) {
        console.error('Error fetching return order:', error);
        return { status: 'error', message: error.message };
    }
};

/**
 * Delete Return Order by ID
 * Reverses inventory changes and removes return order
 */
const deleteReturnOrder = async (returnId) => {
    const transaction = await db.sequelize.transaction();
    
    try {
        const returnOrder = await ReturnOrders.findByPk(returnId, {
            include: [{ model: ReturnOrderItems }]
        });

        if (!returnOrder) {
            return { status: 'error', message: 'Return order not found' };
        }

        // Reverse inventory changes for returned items
        for (const item of returnOrder.returnorderitems || []) {
            // Decrease product storage (reverse the return)
            await ProductStorage.decrement('Quantity', {
                by: item.Quantity,
                where: { ProductID: item.ProductID, LocationID: returnOrder.LocationID },
                transaction
            });

            // Decrease product quantity
            await Product.decrement('QuantityInStock', {
                by: item.Quantity,
                where: { ProductID: item.ProductID },
                transaction
            });
        }

        // Delete inventory transactions related to this return
        await InventoryTransaction.destroy({
            where: { ReferenceID: returnId, TransactionType: 'RETURN' },
            transaction
        });

        // Delete return order items
        await ReturnOrderItems.destroy({
            where: { ReturnID: returnId },
            transaction
        });

        // Delete return order
        await ReturnOrders.destroy({
            where: { ReturnID: returnId },
            transaction
        });

        await transaction.commit();

        return { status: 'success', message: 'Return order deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting return order:', error);
        return { status: 'error', message: error.message };
    }
};

/**
 * Get Return Orders by Date Range
 */
const getReturnOrdersByDateRange = async ({ startDate, endDate }) => {
    try {
        const returnOrders = await ReturnOrders.findAll({
            where: {
                ReturnDate: {
                    [db.Sequelize.Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: ReturnOrderItems,
                    include: [{ model: Product, attributes: ['ProductID', 'Name', 'BuyingPrice'] }]
                },
                { model: SalesOrders, attributes: ['OrderID', 'TotalAmount', 'CustomerID'] },
                { model: User, attributes: ['id', 'username', 'firstname', 'lastname'] }
            ],
            order: [['ReturnDate', 'DESC']]
        });

        return { status: 'success', data: returnOrders };
    } catch (error) {
        console.error('Error fetching return orders by date:', error);
        return { status: 'error', message: error.message };
    }
};

/**
 * Get Return Order Report
 * Returns: Summary stats, product-wise returns, reason analysis
 */
const getReturnOrderReport = async ({ startDate, endDate }) => {
    try {
        // Get summary statistics
        const summaryQuery = await db.sequelize.query(
            `
            SELECT 
                COUNT(DISTINCT ro.ReturnID) AS TotalReturns,
                COUNT(DISTINCT roi.ProductID) AS UniqueProductsReturned,
                COALESCE(SUM(roi.Quantity), 0) AS TotalUnitsReturned,
                COALESCE(SUM(roi.Quantity * p.SellingPrice), 0) AS TotalReturnValue
            FROM returnorders ro
            LEFT JOIN returnorderitems roi ON ro.ReturnID = roi.ReturnID
            LEFT JOIN products p ON roi.ProductID = p.ProductID
            WHERE ro.ReturnDate BETWEEN :startDate AND :endDate
            `,
            {
                replacements: { startDate, endDate },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        // Get product-wise return data
        const productReturns = await db.sequelize.query(
            `
            SELECT 
                p.ProductID,
                p.Name AS ProductName,
                SUM(roi.Quantity) AS TotalReturned,
                SUM(roi.Quantity * p.SellingPrice) AS ReturnValue,
                COUNT(DISTINCT ro.ReturnID) AS ReturnCount
            FROM returnorderitems roi
            JOIN returnorders ro ON roi.ReturnID = ro.ReturnID
            JOIN products p ON roi.ProductID = p.ProductID
            WHERE ro.ReturnDate BETWEEN :startDate AND :endDate
            GROUP BY p.ProductID, p.Name
            ORDER BY TotalReturned DESC
            `,
            {
                replacements: { startDate, endDate },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        // Get reason analysis
        const reasonAnalysis = await db.sequelize.query(
            `
            SELECT 
                Reason,
                COUNT(*) AS ReturnCount,
                SUM(roi.Quantity) AS TotalUnits
            FROM returnorders ro
            LEFT JOIN returnorderitems roi ON ro.ReturnID = roi.ReturnID
            WHERE ro.ReturnDate BETWEEN :startDate AND :endDate
            GROUP BY Reason
            ORDER BY ReturnCount DESC
            `,
            {
                replacements: { startDate, endDate },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        // Get monthly trends
        const monthlyTrends = await db.sequelize.query(
            `
            SELECT 
                MONTH(ro.ReturnDate) AS Month,
                YEAR(ro.ReturnDate) AS Year,
                COUNT(DISTINCT ro.ReturnID) AS ReturnCount,
                COALESCE(SUM(roi.Quantity), 0) AS UnitsReturned,
                COALESCE(SUM(roi.Quantity * p.SellingPrice), 0) AS ReturnValue
            FROM returnorders ro
            LEFT JOIN returnorderitems roi ON ro.ReturnID = roi.ReturnID
            LEFT JOIN products p ON roi.ProductID = p.ProductID
            WHERE ro.ReturnDate BETWEEN :startDate AND :endDate
            GROUP BY YEAR(ro.ReturnDate), MONTH(ro.ReturnDate)
            ORDER BY Year, Month
            `,
            {
                replacements: { startDate, endDate },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        return {
            status: 'success',
            data: {
                summary: summaryQuery[0] || {},
                productReturns,
                reasonAnalysis,
                monthlyTrends
            }
        };
    } catch (error) {
        console.error('Error generating return report:', error);
        return { status: 'error', message: error.message };
    }
};

/**
 * Get Return Orders by Sales Order ID
 */
const getReturnsBySalesOrderId = async (salesOrderId) => {
    try {
        const returns = await ReturnOrders.findAll({
            where: { SalesOrderID: salesOrderId },
            include: [
                {
                    model: ReturnOrderItems,
                    include: [{ model: Product }]
                },
                { model: User, attributes: ['id', 'username', 'firstname', 'lastname'] }
            ],
            order: [['ReturnDate', 'DESC']]
        });

        return { status: 'success', data: returns };
    } catch (error) {
        console.error('Error fetching returns for sales order:', error);
        return { status: 'error', message: error.message };
    }
};

module.exports = { 
    createReturnSalesOrder, 
    getAllReturnOrders,
    getReturnOrderById,
    deleteReturnOrder,
    getReturnOrdersByDateRange,
    getReturnOrderReport,
    getReturnsBySalesOrderId
}

/* {
    "newReturnSalesOrder": {
        "checkSalesOrder": [
            {
                "OrderID": 1,
                "CustomerID": 1,
                "OrderDate": "2025-07-06T20:31:34.000Z",
                "TotalAmount": "5865",
                "Status": "TO DELIVER",
                "Discount": "1035",
                "PaymentStatus": "PAID",
                "DiscountID": 3,
                "createdAt": "2025-07-06T15:01:36.000Z",
                "updatedAt": "2025-07-06T15:01:36.000Z",
                "LocationID": 2
            }
        ],
        "checkSalesOrderItems": [
            {
                "OrderID": 1,
                "ProductID": 1,
                "Quantity": 5,
                "UnitPrice": "1000",
                "createdAt": "2025-07-06T15:01:36.000Z",
                "updatedAt": "2025-07-06T15:01:36.000Z"
            },
            {
                "OrderID": 1,
                "ProductID": 2,
                "Quantity": 2,
                "UnitPrice": "950",
                "createdAt": "2025-07-06T15:01:36.000Z",
                "updatedAt": "2025-07-06T15:01:36.000Z"
            }
        ],
        "createReturnSalesOrder": {
            "ReturnID": 1,
            "SalesOrderID": 1,
            "ReturnDate": "2025-08-05T00:00:00.000Z",
            "Reason": "TEST",
            "CreatedBy": 1,
            "updatedAt": "2025-08-05T07:00:45.393Z",
            "createdAt": "2025-08-05T07:00:45.393Z"
        }
    }
} */