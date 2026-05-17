const express = require('express');
const router = express.Router();
const PurchaseorderdetailController = require('../../controller/purchaseorderdetail.controller')
const {auth} = require('../../middleware/auth')
const validate = require('../../middleware/validate')
const purchaseorderdetailvalidator = require('../../validations/purchaseorderdetails.validation')

router.route('/')
    .post( PurchaseorderdetailController.addPurchaseOrderDetails)

router.route('/:id')
    .get( auth(), validate(purchaseorderdetailvalidator.getPurchaseOrderDetails), PurchaseorderdetailController.getPurchaseOrderDetails)
    .delete( auth(), validate(purchaseorderdetailvalidator.deletePurchaseOrderDetailsByOrderID),  PurchaseorderdetailController.deletePurchaseOrderDetailsByOrderID)

router.route('/:id/:pid')
    .put( auth(), validate(purchaseorderdetailvalidator.updatePurchaseOrderDetails), PurchaseorderdetailController.updatePurchaseOrderDetail)
    .delete( auth(), validate(purchaseorderdetailvalidator.deletePurchaseOrderDetails), PurchaseorderdetailController.deletePurchaseOrderDetail)

module.exports = router