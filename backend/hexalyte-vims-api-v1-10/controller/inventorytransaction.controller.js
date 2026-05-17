const db = require("../models");
const Transaction = db.inventorytransaction;
const inventorytransactionServices = require("../service/inventorytransaction.service");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const addTransaction = catchAsync(async (req, res) => {
  const newTraaction =
    await inventorytransactionServices.addNewInventorytransaction(req.body);
  res.send({ newTraaction });
});

const getAllTransaction = catchAsync(async (req, res) => {
  const allTransactions = await Transaction.findAll();
  if (allTransactions.length == 0) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "No Transactions Found",
    });
  }
  return res.status(httpStatus.OK).send({ allTransactions });
});

const getTransactionById = catchAsync(async (req, res) => {
  const transaction =
    await inventorytransactionServices.getInventorytransactionById(
      req.params.id
    );
  if (!transaction) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "Inventory Transaction not found",
    });
  }
  return res.status(httpStatus.OK).send({ transaction });
});

const updateTransactionById = catchAsync(async (req, res) => {
  const updateTransaction =
    await inventorytransactionServices.updateInventorytransactionById(
      req.params.id,
      req.body
    );
  if (!updateTransaction) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "Inventory Transaction not found",
    });
  }
  return res.status(httpStatus.OK).send({ updateTransaction });
});

const deleteTransactionById = catchAsync(async (req, res) => {
  const deletedTransaction =
    await inventorytransactionServices.deleteInventorytransactionById(
      req.params.id
    );
  if (!deletedTransaction) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "Inventory Transaction not found",
    });
  }
  return res.status(httpStatus.OK).send({ deletedTransaction });
});

module.exports = {
  addTransaction,
  getAllTransaction,
  getTransactionById,
  deleteTransactionById,
  updateTransactionById,
};
