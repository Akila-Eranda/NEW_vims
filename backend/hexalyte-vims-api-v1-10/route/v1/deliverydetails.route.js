const express = require("express");
const router = express.Router();
const deliveryDetailsController = require("../../controller/deliverydetails.controller");
const {auth} = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const deliveryDetailsValidation = require('../../validations/deliverydetails.validation');
router
  .route("/")
  .get(auth(), deliveryDetailsController.getDeliveryDetails)
  .post(auth(), validate(deliveryDetailsValidation.addDeliveryDetails),deliveryDetailsController.addDeliveryDetails);

router
  .route("/:id")
  .get(validate(deliveryDetailsValidation.getDeliveryDetailsById),deliveryDetailsController.getDeliveryDetailsById)
  .put(auth(), validate(deliveryDetailsValidation.updateDeliveryDetailById),deliveryDetailsController.updateDeliveryDetailsById)
  .delete(auth(),  validate(deliveryDetailsValidation.deleteDeliveryDetailsById),deliveryDetailsController.deleteDeliveryDetailsById);

module.exports = router;
