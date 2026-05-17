const express = require('express');
const router = express.Router();
const SalesorderdeatilsController = require('../../controller/salesorderdetails.controller'); 
const validate = require('../../middleware/validate');
const salesorderdetailsvalidate=require('../../validations/salesorderdetails.validation')
const {auth} = require('../../middleware/auth');

router
  .route('/')
  .post( auth(), validate(salesorderdetailsvalidate.createSalesOrderDetail), SalesorderdeatilsController.createSalesOrderDetails)
  .get( auth(), SalesorderdeatilsController.getAllSalesOrderDetails);

router
  .route('/:OrderId')
  .get(auth(), SalesorderdeatilsController.getSalesOrderDetailsByOrderID)  

router
  .route('/:OrderId/:ProductId')
  .get( auth(), SalesorderdeatilsController.getSalesOrderDetailsByID)
  .delete( auth(), validate(salesorderdetailsvalidate.deleteSalesOrderDetail), SalesorderdeatilsController.deleteSalesOrderDetails)
  .put(auth(), validate(salesorderdetailsvalidate.createSalesOrderDetail), SalesorderdeatilsController.updateSalesOrderDetails); 
module.exports = router;
