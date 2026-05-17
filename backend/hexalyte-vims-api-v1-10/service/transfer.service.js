const db = require('../models');
const warehousetransfers = db.warehousetransfers;
const WarehouseStock = db.productstorage;
const sequelize = db.sequelize;
const Warehouse = db.warehouselocation;
const Product = db.product;



const getAllTransfers = async () => {
    const transfers = await warehousetransfers.findAll({
        include: [
            {
                model: Product,
                attributes: ['ProductID', 'Name']
            },
            {
                model: Warehouse,
                as: 'sourceWarehouse',
                attributes: ['LocationID', 'WarehouseName']
            },
            {
                model: Warehouse,
                as: 'targetWarehouse',
                attributes: ['LocationID', 'WarehouseName']
            },
        ],
        order: [['transferDate', 'DESC']]
    });

    return transfers;
};

const transferStock = async ({
    ProductID,
    sourceWarehouseId,
    targetWarehouseId,
    quantity,
    transferBy,
    notes
}) => {
    if (sourceWarehouseId === targetWarehouseId) {
        return { message: 'Source and target warehouses must be different.' };
    }

    const [sourceWarehouse, targetWarehouse, product] = await Promise.all([
        Warehouse.findByPk(sourceWarehouseId),
        Warehouse.findByPk(targetWarehouseId),
        Product.findByPk(ProductID),
    ]);

    if (!product) {
        return { message: `Product does not exist.` };
    }

    if (!sourceWarehouse) {
        return {
            message: `Source warehouse does not exist.`
        };
    }

    if (!targetWarehouse) {
        return {
            message: `target Warehouse does not exist.`
        };
    }

    const t = await sequelize.transaction();

    try {
        const sourceStock = await WarehouseStock.findOne({
            where: { ProductID, LocationID: sourceWarehouseId },
            transaction: t
        });

        if (!sourceStock || sourceStock.Quantity < quantity) {
            return { message: 'Insufficient stock in the source warehouse.' };
        }

        sourceStock.Quantity -= quantity;
        await sourceStock.save({ transaction: t });

        const targetStock = await WarehouseStock.findOne({
            where: { ProductID, LocationID: targetWarehouseId },
            transaction: t
        });

        if (targetStock) {
            targetStock.Quantity += quantity;
            targetStock.LastUpdated = new Date();
            await targetStock.save({ transaction: t });
        } else {
            await WarehouseStock.create({
                ProductID,
                LocationID: targetWarehouseId,
                Quantity: quantity,
                LastUpdated: new Date()
            }, { transaction: t });
        }

        const transferRecord = await warehousetransfers.create({
            ProductID,
            sourceWarehouseId,
            targetWarehouseId,
            quantity,
            transferBy,
            notes,
            transferDate: new Date()
        }, { transaction: t });

        await t.commit();
        return {
            success: true,
            message: 'Transfer completed successfully.',
            transfer: transferRecord
        };
    } catch (error) {
        await t.rollback();
        throw error;
    }
};


// const transferBulkStock = async (transfers) => {

//     for (const [index, transfer] of transfers.entries()) {
//         if (transfer.sourceWarehouseId === transfer.targetWarehouseId) {
//             return { message: `Transfer ${index + 1}: Source and target warehouses must be different` };
//         }
//     }

//     const productIds = [...new Set(transfers.map(t => t.ProductID))];
//     const warehouseIds = [...new Set(transfers.flatMap(t => [t.sourceWarehouseId, t.targetWarehouseId]))];

//     const [products, warehouses] = await Promise.all([
//         Product.findAll({ where: { ProductID: productIds } }),
//         Warehouse.findAll({ where: { LocationID: warehouseIds } })
//     ]);

//     const existingProductIds = products.map(p => p.ProductID);
//     const existingWarehouseIds = warehouses.map(w => w.LocationID);

//     for (const [index, transfer] of transfers.entries()) {
//         if (!existingProductIds.includes(transfer.ProductID)) {
//             return { message: `Transfer ${index + 1}: Product does not exist` };
//         }
//         if (!existingWarehouseIds.includes(transfer.sourceWarehouseId)) {
//             return { message: `Transfer ${index + 1}: Source warehouse does not exist` };
//         }
//         if (!existingWarehouseIds.includes(transfer.targetWarehouseId)) {
//             return { message: `Transfer ${index + 1}: Target warehouse does not exist` };
//         }
//     }

//     const t = await sequelize.transaction();
//     try {
//         const stockRequirements = {};

//         for (const transfer of transfers) {
//             const key = `${transfer.ProductID}_${transfer.sourceWarehouseId}`;
//             stockRequirements[key] = (stockRequirements[key] || 0) + transfer.quantity;
//         }

//         for (const key of Object.keys(stockRequirements)) {
//             const [ProductID, sourceWarehouseId] = key.split("_");
//             const sourceStock = await WarehouseStock.findOne({
//                 where: {
//                     ProductID,
//                     LocationID: sourceWarehouseId
//                 },
//                 transaction: t
//             });

//             if (!sourceStock || sourceStock.Quantity < stockRequirements[key]) {
//                 await t.rollback();
//                 return { message: `Insufficient stock in source warehouse ${sourceWarehouseId} for Product ${ProductID}` };
//             }
//         }

//         const transferRecords = [];

//         for (const transfer of transfers) {
//             const sourceStock = await WarehouseStock.findOne({
//                 where: {
//                     ProductID: transfer.ProductID,
//                     LocationID: transfer.sourceWarehouseId
//                 },
//                 transaction: t
//             });

//             sourceStock.Quantity -= transfer.quantity;
//             await sourceStock.save({ transaction: t });

//             let targetStock = await WarehouseStock.findOne({
//                 where: {
//                     ProductID: transfer.ProductID,
//                     LocationID: transfer.targetWarehouseId
//                 },
//                 transaction: t
//             });

//             if (targetStock) {
//                 targetStock.Quantity += transfer.quantity;
//                 targetStock.LastUpdated = new Date();
//                 await targetStock.save({ transaction: t });
//             } else {
//                 targetStock = await WarehouseStock.create({
//                     ProductID: transfer.ProductID,
//                     LocationID: transfer.targetWarehouseId,
//                     Quantity: transfer.quantity,
//                     LastUpdated: new Date()
//                 }, { transaction: t });
//             }

//             const transferRecord = await warehousetransfers.create({
//                 ProductID: transfer.ProductID,
//                 sourceWarehouseId: transfer.sourceWarehouseId,
//                 targetWarehouseId: transfer.targetWarehouseId,
//                 quantity: transfer.quantity,
//                 transferBy: transfer.transferBy,
//                 notes: transfer.notes || '',
//                 transferDate: new Date()
//             }, { transaction: t });

//             transferRecords.push(transferRecord);
//         }

//         await t.commit();

//         return {
//             success: true,
//             message: `${transfers.length} transfers completed successfully`,
//             transfers: transferRecords
//         };

//     } catch (error) {
//         if (!t.finished) {
//             await t.rollback();
//         }
//         throw error;
//     }
// };

const transferBulkStock = async (transfers) => {
    for (const [index, transfer] of transfers.entries()) {
        if (transfer.sourceWarehouseId === transfer.targetWarehouseId) {
            return { message: `Transfer ${index + 1}: Source and target warehouses must be different` };
        }
    }

    const productIds = [...new Set(transfers.map(t => Number(t.ProductID)))];
    const warehouseIds = [...new Set(transfers.flatMap(t => [Number(t.sourceWarehouseId), Number(t.targetWarehouseId)]))];

    const [products, warehouses] = await Promise.all([
        Product.findAll({ where: { ProductID: productIds } }),
        Warehouse.findAll({ where: { LocationID: warehouseIds } })
    ]);

    const existingProductIds = products.map(p => Number(p.ProductID));
    const existingWarehouseIds = warehouses.map(w => Number(w.LocationID));

    for (const [index, transfer] of transfers.entries()) {
        if (!existingProductIds.includes(Number(transfer.ProductID))) {
            return { message: `Transfer ${index + 1}: Product does not exist` };
        }
        if (!existingWarehouseIds.includes(Number(transfer.sourceWarehouseId))) {
            return { message: `Transfer ${index + 1}: Source warehouse does not exist` };
        }
        if (!existingWarehouseIds.includes(Number(transfer.targetWarehouseId))) {
            return { message: `Transfer ${index + 1}: Target warehouse does not exist` };
        }
    }

    const t = await sequelize.transaction();
    try {
        const stockRequirements = {};

        for (const transfer of transfers) {
            const key = `${transfer.ProductID}_${transfer.sourceWarehouseId}`;
            stockRequirements[key] = (stockRequirements[key] || 0) + Number(transfer.quantity);
        }

        for (const key of Object.keys(stockRequirements)) {
            const [ProductID, sourceWarehouseId] = key.split("_").map(Number);
            const sourceStock = await WarehouseStock.findOne({
                where: { ProductID, LocationID: sourceWarehouseId },
                transaction: t
            });

            if (!sourceStock || Number(sourceStock.Quantity) < stockRequirements[key]) {
                await t.rollback();
                return { message: `Insufficient stock in source warehouse ${sourceWarehouseId} for Product ${ProductID}` };
            }
        }

        const transferRecords = [];

        for (const transfer of transfers) {
            const sourceStock = await WarehouseStock.findOne({
                where: {
                    ProductID: Number(transfer.ProductID),
                    LocationID: Number(transfer.sourceWarehouseId)
                },
                transaction: t
            });

            sourceStock.Quantity = Number(sourceStock.Quantity) - Number(transfer.quantity);
            sourceStock.Quantity = Number(sourceStock.Quantity.toFixed(2));
            await sourceStock.save({ transaction: t });

            let targetStock = await WarehouseStock.findOne({
                where: {
                    ProductID: Number(transfer.ProductID),
                    LocationID: Number(transfer.targetWarehouseId)
                },
                transaction: t
            });

            if (targetStock) {
                targetStock.Quantity = Number(targetStock.Quantity) + Number(transfer.quantity);
                targetStock.Quantity = Number(targetStock.Quantity.toFixed(2));
                targetStock.LastUpdated = new Date();
                await targetStock.save({ transaction: t });
            } else {
                targetStock = await WarehouseStock.create({
                    ProductID: Number(transfer.ProductID),
                    LocationID: Number(transfer.targetWarehouseId),
                    Quantity: Number(transfer.quantity.toFixed(2)),
                    LastUpdated: new Date()
                }, { transaction: t });
            }

            const transferRecord = await warehousetransfers.create({
                ProductID: Number(transfer.ProductID),
                sourceWarehouseId: Number(transfer.sourceWarehouseId),
                targetWarehouseId: Number(transfer.targetWarehouseId),
                quantity: Number(transfer.quantity),
                transferBy: transfer.transferBy,
                notes: transfer.notes || '',
                transferDate: new Date()
            }, { transaction: t });

            transferRecords.push(transferRecord);
        }

        await t.commit();

        return {
            success: true,
            message: `${transfers.length} transfers completed successfully`,
            transfers: transferRecords
        };

    } catch (error) {
        if (!t.finished) {
            await t.rollback();
        }
        throw error;
    }
};


module.exports = {
    transferStock,
    transferBulkStock,
    getAllTransfers
};


