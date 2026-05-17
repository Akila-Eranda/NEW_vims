const express = require("express");
const router = express.Router();
const customerController = require("../../controller/customer.controller");
const {auth} = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const customerValidation = require('../../validations/customer.validation');

router
  .route("/")
  .get(auth(), customerController.getAllCustomers)
  .post(auth(), customerController.addCustomer);

router
  .route("/:id")
  .get(auth(), validate(customerValidation.getCustomerById),customerController.getCustomerById)
  .put(auth(), customerController.updateCustomerById)
  .delete(auth(), validate(customerValidation.deleteCustomerById),customerController.deleteCustomerById);

router
  .route("/:id/orders")
  .get(auth(), customerController.getCustomerOrderHistory);

module.exports = router;
