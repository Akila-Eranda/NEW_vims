const express = require("express");
const router = express.Router();
const transactionController = require("../../controller/inventorytransaction.controller");
const {auth} = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const transactionValidation = require('../../validations/inventorytransaction.validation');

router
  .route("/")
  .get(auth(), transactionController.getAllTransaction)
  .post(auth(), validate(transactionValidation.addTransaction),transactionController.addTransaction);

router
  .route('/:id')
  .get( auth(), validate(transactionValidation.getTransactionById),transactionController.getTransactionById)
  .put( auth(), validate(transactionValidation.updateTransactionById),transactionController.updateTransactionById)
  .delete( auth(), validate(transactionValidation.deleteTransactionById),transactionController.deleteTransactionById);

module.exports = router;