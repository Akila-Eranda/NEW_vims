const db = require("../models");
const Inventorytransaction = db.inventorytransaction;

// Add new inventorytransaction
const addNewInventorytransaction = async (params) => {

    const {
      SalesOrderID,
      PurchaseOrderID,
      ProductID,
      Quantity,
      TransactionDate,
      TransactionType,
    } = params;

    const transaction = {
      SalesOrderID,
      PurchaseOrderID,
      ProductID,
      Quantity,
      TransactionDate,
      TransactionType,
    };
    const transactionRow = await Inventorytransaction.create(transaction)
    return transactionRow

};

// Get all inventorytransaction
const getAllInventorytransaction = async (filter, options) => {
  const inventorytransactions = await Inventorytransaction.findAll();
  return inventorytransactions;
};

// Get inventorytransaction By Id
const getInventorytransactionById = async (inTrId) => {
  const inventorytransactions = await Inventorytransaction.findOne({
    where: { TransactionID: inTrId },
  });
  return inventorytransactions;
};

// Update Inventorytransaction By Id
const updateInventorytransactionById = async (inTrId, updateBody) => {
  const { SalesOrderID, PurchaseOrderID, ProductID, Quantity, TransactionDate, TransactionType } =
    updateBody;
  const inventorytransaction = {
    SalesOrderID,
    PurchaseOrderID,
    ProductID,
    Quantity,
    TransactionDate,
    TransactionType,
  };
  const row = await Inventorytransaction.update(inventorytransaction, {
    where: { TransactionID: inTrId },
  });
  return { message: "Inventory Transacrtion successfully updated" };
};

// Delete inventorytransaction By Id
const deleteInventorytransactionById = async (inTrId) => {
  const row = await Inventorytransaction.destroy({
    where: { TransactionID: inTrId },
  });
  return { message: "Inventory Transaction successfully deleted" };
};

module.exports = {
  addNewInventorytransaction,
  getAllInventorytransaction,
  getInventorytransactionById,
  updateInventorytransactionById,
  deleteInventorytransactionById,
};
