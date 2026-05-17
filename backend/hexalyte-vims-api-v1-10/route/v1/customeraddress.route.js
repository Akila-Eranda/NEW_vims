const express = require("express");
const router = express.Router();
const customerAddressController = require("../../controller/customeraddress.controller");
const {auth} = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const customerAddressValidation = require('../../validations/customeraddress.validation');

router
  .route("/")
  .get(auth(), customerAddressController.getAllCustomerAdress)
  .post(auth(), customerAddressController.addCustomerAddress);

router
  .route("/:id")
  .get(auth(), validate(customerAddressValidation.getCustomerAddressById),customerAddressController.getCustomerAddressById)
  .put(auth(), customerAddressController.updateCustomerAddressById)
  .delete(auth(), validate(customerAddressValidation.deleteCustomerAddressById),customerAddressController.deleteAddressById);

module.exports = router;
