const express = require("express");
const router = express.Router();
const {auth} = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const discountController = require('../../controller/discount.controller')

router
  .route('/')
  .get(auth(), discountController.getAllDiscounts)
  .post(auth(), discountController.createDiscount);

router
  .route("/id/:id")
  .get(auth(), discountController.getDiscountsByID)
//   .put(auth(), validate(categoryValidation.updateCategoryById),categoryController.updateCategoryById)
  .delete(auth(), discountController.deleteDiscount);

router
    .route("/sales")
    .get(auth(), discountController.getDiscountsForSalesOrders)

router
    .route("/purchase")
    .get(auth(), discountController.getDiscountsForPurchaseOrders)

module.exports = router;