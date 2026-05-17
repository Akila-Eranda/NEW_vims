const express = require('express');
const router = express.Router();
const salesorderController = require('../../controller/salesorder.controller');
const validate = require('../../middleware/validate');
const salesorderValidation = require('../../validations/salesorder.validation');
const { auth } = require('../../middleware/auth');
const salesorderInvoice = require('../../controller/salesorderinvoice.controller');

// ==================== REPORT ROUTES ====================
// These must be defined BEFORE :id routes to avoid conflicts

router
  .route('/report/sales')
  .get(salesorderController.getsalesreport);

router
  .route('/report/monthly-trends')
  .get(auth(), salesorderController.getMonthlySalesTrends);

router
  .route('/report/by-customer')
  .get(auth(), salesorderController.getSalesByCustomerReport);

router
  .route('/report/unpaid')
  .get(auth(), salesorderController.getUnpaidOrdersReport);

router
  .route('/summery/paidsummery')
  .get(salesorderController.getPaymentStatsummery);

// ==================== CUSTOMER OUTSTANDING BALANCE ====================
// Get outstanding balance for a specific customer
// Must be defined BEFORE :id routes to avoid conflicts

router
  .route('/customer/:customerId/outstanding-balance')
  .get(auth(), salesorderController.getCustomerOutstandingBalance);

// ==================== CRUD ROUTES ====================

router
  .route('/')
  .post(auth(), validate(salesorderValidation.createsalesorder), salesorderController.createsalesorder)
  .get(auth(), salesorderController.getallsalesorder);

router
  .route('/update/:id')
  .put(auth(), salesorderController.updateSalesorder)

router
  .route('/bulk-mark-paid')
  .put(auth(), salesorderController.bulkMarkAsPaid)

router
  .route('/:id')
  .get(auth(), salesorderController.getsalesorderbyID)
  .delete(auth(), validate(salesorderValidation.deletesalesorder), salesorderController.deletesalesorder)
  .put(auth(), salesorderController.updateSalesorderPaymentStatus);


module.exports = router;         
