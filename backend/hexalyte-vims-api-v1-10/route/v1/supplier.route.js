const express = require('express');
const router = express.Router();
const supplierController = require('../../controller/supplier.controller');
const validate = require('../../middleware/validate');
const supplierValidation = require('../../validations/supplier.validation');
const {auth} = require('../../middleware/auth');
router
  .route('/')
  .post(auth(), validate(supplierValidation.createSupplier), supplierController.createsupplier)
  .get(auth(), supplierController.getallsupplier);


router
  .route('/:id')
  .get(auth(), validate(supplierValidation.getSupplierByID), supplierController.getsupplierbyID)
  .delete(auth(), validate(supplierValidation.deleteSupplier), supplierController.deletesupplier)
  .put(auth(), validate(supplierValidation.updateSupplier), supplierController.updatesupplier);

module.exports = router;

